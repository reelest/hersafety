import { increment, runTransaction, writeBatch } from "firebase/firestore";
import { firestore } from "@/logic/firebase_init";
import { Model, Item, noFirestore } from "./model";
import { FailedPrecondition, InvalidState } from "./errors";

const createdCounters = new Set();

export const ensureCounter = async (model) => {
  const counter = model.counter;
  if (process.env.NODE_ENV !== "production") {
    if (createdCounters.has(counter.uniqueName())) return true;
    else {
      await counter._model.getOrCreate(counter.id(), async (item, txn) => {
        if (item.isLocalOnly()) {
          console.log("Creating counter " + item.uniqueName());
          await model.initCounter(item);
          await item.save(txn);
        }
      });
      createdCounters.add(counter.uniqueName());
    }
  }
};

/**
 * A counted item is an item that updates external documents when it changes.
 * It does this using transactions.
 * This is used for keeping counts, sums etc.
 */
export class CountedItem extends Item {
  #needsTransaction = false;
  scheduleUpdateTransaction() {
    console.log("Scheduling transac tion");
    this.#needsTransaction = true;
  }
  getCounter() {
    return this._model.counter;
  }
  async onAddItem(txn) {
    this.getCounter().set(
      {
        itemCount: increment(1),
      },
      txn
    );
  }

  async onDeleteItem(txn) {
    this.getCounter().set(
      {
        itemCount: increment(-1),
      },
      txn
    );
  }
  async onUpdateItem(txn, currentState, lastState) {
    // Do nothing
  }
  /**
   * @param {(txn: import("firebase/firestore").Transaction, doc: ThisType)=>Promise} onUpdate
   * @returns
   */
  async atomicUpdate(onUpdate) {
    return runTransaction(firestore, async (txn) => {
      const doc = await txn.get(this._ref);
      if (doc.exists()) {
        return await onUpdate(txn, doc.data());
      }
      return false;
    });
  }
  async _update(txn, newState, oldState = null) {
    console.log("Updating....");
    if (this.#needsTransaction) {
      if (txn) {
        if (!oldState)
          throw new FailedPrecondition(FailedPrecondition.NO_PREV_STATE);
        console.log("Running in transaction");
        await super._update(txn, newState);
        return await this.onUpdateItem(txn, newState, oldState);
      }
      return this.atomicUpdate(async (txn, doc) =>
        this._update(txn, newState, doc)
      );
    } else return super._update(txn, newState);
  }
  async save(txn) {
    console.log("Saving.....");
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (this._isLocalOnly) {
      //TODO: do this in a transaction
      await ensureCounter(this._model);
      const _txn = txn ?? writeBatch(firestore);
      _txn.set(this._ref, this.data());
      await this.onAddItem(_txn, this.data());
      if (!txn) await _txn.commit();
      this._isLocalOnly = false;
    } else await super.save(txn);
    this.#needsTransaction = false;
  }
  async delete(txn, oldState) {
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (txn) {
      await this.onDeleteItem(txn, oldState);
      txn.delete(this._ref);
    } else {
      if (!oldState)
        throw new FailedPrecondition(FailedPrecondition.NO_PREV_STATE);
      await this.atomicUpdate(async (txn, doc) => {
        this.delete(txn, doc);
      });
    }
  }
  static markTriggersUpdateTxn(props) {
    props.forEach((e) => {
      let x;
      const descriptor = {
        enumerable: true,
        get() {
          return x;
        },
        set(v) {
          if (this._isLoaded && v !== x) {
            this.scheduleUpdateTransaction();
          }
          x = v;
        },
      };
      Object.defineProperty(this.prototype, e, {
        ...descriptor,
        set(v) {
          //Make this an own property so it can be picked by Object.keys
          Object.defineProperty(this, e, descriptor);
          descriptor.set.call(this, v);
        },
      });
    });
  }
}
class MetadataItem extends Item {
  itemCount = 0;
}

const Metadata = new Model("metadata", MetadataItem);
export class CountedModel extends Model {
  constructor(_collectionID, ItemClass = CountedItem, ...props) {
    super(_collectionID, ItemClass ?? CountedItem, ...props);
    this.counter = Metadata.item(this._ref.path);
    if (!noFirestore)
      ensureCounter(this).catch((e) => {
        console.error(`Failed to ensure counter ${e}`);
      });
  }

  async count() {
    await ensureCounter(this);
    return (await this.counter.load()).itemCount;
  }
  async initCounter(doc) {
    doc.itemCount = increment(0);
  }
  item(id, isCreate) {
    /** Item._isLocalOnly should never be set to true manually especially for CountedItems as it breaks safety checks/speedups in Item.save. */
    if (isCreate)
      throw new Error(
        "Synthetic ids are not allowed for counted models. To create one anyway, use `new Table.Item(Table.ref(id), true, Table)`"
      );
    return new this.Item(this.ref(id), false, this);
  }
}
