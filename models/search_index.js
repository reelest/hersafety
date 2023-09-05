import { Item, Model } from "./lib/model";

export class IndexEntry extends Item {
  title = "";
  category = "";
  tokens = [];
}
/** @type {Model<IndexEntry>} */
export const SearchIndex = new Model("search_index", IndexEntry);
