import { increment } from "firebase/firestore";
import { Model, Item, noFirestore, USES_EXACT_IDS } from "./model";
import { CountedItem } from "./counted_item";

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

class MetadataItem extends Item {
  itemCount = 0;
}

const Metadata = new Model("metadata", MetadataItem, {
  [USES_EXACT_IDS]: true,
});
export class CountedModel extends Model {
  /**
   * @param {ConstructorParameters<typeof Model>[0]} _collectionID
   * @param {ConstructorParameters<typeof Model>[1]} ItemClass
   * @param {[ConstructorParameters<typeof Model>[2]]} props
   */
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
}
