import { increment, writeBatch } from "firebase/firestore";
import { firestore } from "@/logic/firebase_init";
import { Model, Item, noFirestore } from "./model";
import { InvalidState } from "./errors";

const createdCounters = new Set();

export const ensureCounter = async (model) => {
  const counter = model.counter;
  if (process.env.NODE_ENV !== "production") {
    if (createdCounters.has(counter.uniqueName())) return true;
    else {
      const doc = await counter._model.getOrCreate(counter._ref.id);
      if (doc.isLocalOnly()) {
        console.log("Creating counter " + doc.uniqueName());
        await model.initCounter(doc);
        await doc.save();
      }
      createdCounters.add(counter.uniqueName());
    }
  }
};
export class CountedItem extends Item {
  getCounter() {
    return this._model.counter;
  }
  async onAddItem(txn) {
    this.getCounter().update(txn, {
      itemCount: increment(1),
    });
  }

  async onDeleteItem(txn) {
    this.getCounter().update(txn, {
      itemCount: increment(-1),
    });
  }

  async save() {
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (this._isLocalOnly) {
      await ensureCounter(this._model);
      const batch = writeBatch(firestore);
      batch.set(this._ref, this.data());
      await this.onAddItem(batch, this.data());
      await batch.commit();
      this._isLocalOnly = false;
    } else await super.save();
  }
  async delete() {
    if (noFirestore) throw InvalidState("No Firestore!!");
    await this.atomicUpdate(async (txn, doc) => {
      txn.delete(this._ref);
      await this.onDeleteItem(txn, doc);
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
