import { increment, runTransaction, writeBatch } from "firebase/firestore";
import { firestore } from "@/logic/firebase_init";
import { Model, Item, noFirestore } from "./model";
import { FailedPrecondition, InvalidState } from "./errors";
import deepEqual from "deep-equal";

const createdCounters = new Set();

export const ensureCounter = async (model) => {
  const counter = model.counter;
  if (!counter) return;
  if (process.env.NODE_ENV !== "production") {
    if (createdCounters.has(counter.uniqueName())) return true;
    else {
      await counter.model().getOrCreate(counter.id(), async (item, txn) => {
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
const NO_TRANSACTION_NEEDED = 0;
const TRANSACTION_NEEDED_NO_PREV_STATE = 1;
const TRANSACTION_NEEDED = 2;
export class CountedItem extends Item {
  #needsTransaction = NO_TRANSACTION_NEEDED;
  scheduleUpdateTransaction(needsPrevState) {
    console.log("Scheduling transaction.....");
    this.#needsTransaction = Math.max(
      this.#needsTransaction,
      needsPrevState ? TRANSACTION_NEEDED : TRANSACTION_NEEDED_NO_PREV_STATE
    );
  }
  didUpdate(prop, newState, prevState) {
    return true;
  }
  getCounter() {
    return this.model().counter;
  }
  async onAddItem(txn) {
    if (this.getCounter())
      this.getCounter().set(
        {
          itemCount: increment(1),
        },
        txn
      );
  }

  async onDeleteItem(txn) {
    if (this.getCounter())
      this.getCounter().set(
        {
          itemCount: increment(-1),
        },
        txn
      );
  }
  async onUpdateItem(txn, newState, lastState) {
    // Do nothing
  }

  /**
   * @param {(txn: import("firebase/firestore").Transaction, doc: ThisType)=>Promise} cb
   * @returns
   */
  async atomicUpdate(cb, needsPrevState = true, txn, prevState) {
    if (txn) {
      if (needsPrevState && !prevState)
        throw new FailedPrecondition(FailedPrecondition.NO_PREV_STATE);
      return await cb(txn, prevState);
    } else if (needsPrevState) {
      return runTransaction(firestore, async (txn) => {
        const doc = await txn.get(this._ref);
        if (doc.exists()) {
          return await cb(txn, doc.data());
        }
        return false;
      });
    } else {
      const batch = writeBatch(firestore);
      const ret = await cb(batch);
      await batch.commit();
      return ret;
    }
  }
  async _update(txn, newState, prevState = null) {
    console.log("Updating....");
    return this.atomicUpdate(
      async (txn, prevState) => {
        await this._update(txn, newState, prevState);
        await this.onUpdateItem(txn, newState, prevState);
      },
      this.#needsTransaction === TRANSACTION_NEEDED,
      txn,
      prevState
    );
  }
  async save(txn, prevState) {
    console.log("Saving.....");
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (this._isLocalOnly) {
      //TODO: Needs testing to assert that _isLocalOnly assertion is actually true
      await ensureCounter(this.model());
      this.atomicUpdate(
        async (txn) => {
          txn.set(this._ref, this.data(), { merge: true });
          await this.onAddItem(txn, this.data());
        },
        false,
        txn,
        prevState
      );
      this._isLocalOnly = false;
    } else await super.save(txn);
    this.#needsTransaction = NO_TRANSACTION_NEEDED;
  }
  async delete(txn, prevState) {
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (txn) {
      await this.onDeleteItem(txn, prevState);
      await super.delete(txn);
    } else {
      if (!prevState)
        throw new FailedPrecondition(FailedPrecondition.NO_PREV_STATE);
      await this.atomicUpdate(
        async (txn, prevState) => this.delete(txn, prevState),
        true,
        txn,
        prevState
      );
    }
  }
  static markTriggersUpdateTxn(props, needsPrevState = true) {
    props.forEach((e) => {
      let x;
      const descriptor = {
        enumerable: true,
        get() {
          return x;
        },
        set(v) {
          if (this._isLoaded && !deepEqual(v, x)) {
            this.scheduleUpdateTransaction(needsPrevState);
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
  async initCounter(item) {
    item.itemCount = increment(0);
  }
  item(id, isCreate) {
    /** Item._isLocalOnly should never be set to true manually especially for CountedItems as it breaks safety checks/speedups in Item.save. */
    if (isCreate)
      throw new Error(
        "Use getOrCreate for synthetic ids when using counted models. To create one anyway, use `new Model.Item(Model.ref(id), true, Model)`"
      );
    return super.item(id, isCreate);
  }
}
