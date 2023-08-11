import { increment, writeBatch, runTransaction } from "firebase/firestore";
import { firestore } from "@/logic/firebase_init";
import { Model, Item, noFirestore } from "./model";
import { InvalidState } from "./errors";

const Metadata = new Model("metadata", null, { value: 0 });
const createdCounters = new Set();

export const ensureCounter = async (id) => {
  if (process.env.NODE_ENV !== "production") {
    if (createdCounters.has(id)) return true;
    else {
      const doc = await Metadata.getOrCreate(id);
      if (doc.isLocalOnly()) {
        doc.value = increment(0);
        await doc.save();
      }
      createdCounters.add(id);
    }
  }
};
export class CountedItem extends Item {
  async save() {
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (this._isLocalOnly) {
      await ensureCounter(this._ref.parent.path);
      const batch = writeBatch(firestore);
      batch.set(this._ref, this.data());
      batch.update(Metadata.ref(this._ref.parent.path), {
        value: increment(1),
      });
      await batch.commit();
      this._isLocalOnly = false;
    } else await super.save();
  }
  async delete() {
    if (noFirestore) throw InvalidState("No Firestore!!");
    await runTransaction(firestore, async (txn) => {
      const doc = await txn.get(this._ref);
      if (doc.exists()) {
        txn.delete(this._ref);
        txn.update(Metadata.ref(this._ref.parent.path), {
          value: increment(-1),
        });
      }
    });
  }
}

export class CountedModel extends Model {
  constructor(_collectionID, ItemClass = CountedItem, ...props) {
    super(_collectionID, ItemClass ?? CountedItem, ...props);
    this.counter = Metadata.item(this._ref.path);
    if (!noFirestore) ensureCounter(this._ref.path);
  }
  async count() {
    return (await this.counter.load()).value;
  }
  item(id, isCreate) {
    /** Item._isLocalOnly should never be set to true manually especially for CountedItems as it breaks safety checks/speedups in Item.save. */
    if (isCreate)
      throw new Error(
        "Synthetic ids are not allowed for counted models. To create one anyway, use `new Model.Item(Model.ref(id), Model.Empty, true)`"
      );
    return new this.Item(this.ref(id), this.Empty, isCreate);
  }
}
