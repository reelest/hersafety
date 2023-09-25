import UpdateValue from "./update_value";
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
/**
 * @template {CountedItem} T
 * @extends {Model<T>}
 */
export class CountedModel extends Model {
  /**
   * @param {string} _collectionID
   * @param {Class<T>} ItemClass
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
    item.itemCount = UpdateValue.add(0);
  }
}
