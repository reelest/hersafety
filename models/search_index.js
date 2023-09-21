import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";
import { Item, Model } from "./lib/model";

export class IndexEntry extends Item {
  title = "";
  description = "";
  avatar = "";
  image = "";
  filters = [];
  tokens = [];
  getItemId() {
    return this.id().split("^").pop();
  }
}
/** @type {Model<IndexEntry>} */
export const SearchIndex = new Model("search_index", IndexEntry, {
  [MODEL_ITEM_PREVIEW](item) {
    return item;
  },
});
