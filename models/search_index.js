import { Item, Model, USES_EXACT_IDS } from "./lib/model";
import { CountedItem } from "./lib/counted_item";
import UpdateValue from "./lib/update_value";
import notIn from "@/utils/notIn";

export const SearchTags = new Model("search_tags", Item);
const collections = new Map();
export class IndexEntry extends CountedItem {
  tokens = [];
  getItem() {
    const [collection, id] = this.id().split("^").pop();
    return collections.get(collection).item(id);
  }
  getModel() {
    const [collection] = this.id().split("^").pop();
    return collections.get(collection);
  }
  async onAddItem(txn, newState) {
    await super.onAddItem(txn, newState);
    updateTokens(newState.tokens, this.id(), txn, UpdateValue.arrayUnion);
  }
  async onDeleteItem(txn, prevState) {
    await super.onDeleteItem(txn, prevState);
    updateTokens(prevState.tokens, this.id(), txn, UpdateValue.arrayRemove);
  }
  async onUpdateItem(txn, newState, prevState) {
    await super.onUpdateItem(txn, newState, prevState);
    console.log({ newState, prevState });
    const added = newState.tokens.filter(notIn(prevState.tokens));
    const removed = prevState.tokens.filter(notIn(newState.tokens));
    updateTokens(removed, this.id(), txn, UpdateValue.arrayRemove);
    updateTokens(added, this.id(), txn, UpdateValue.arrayUnion);
  }
  static {
    this.markTriggersUpdateTxn(["tokens"], true);
  }
}

const INDEX_SIZE = 3;
function updateTokens(tokens, id, txn, method) {
  const m = {};
  tokens.forEach((token) => {
    const index = getIndex(token);
    if (!m[index]) m[index] = {};
    console.log({ id, token });
    m[index][token.slice(INDEX_SIZE) || "-"] = (
      m[index][token.slice(INDEX_SIZE) || "-"] || []
    ).concat(id);
  });
  for (let index in m) {
    for (let token in m[index]) {
      m[index][token] = method(...m[index][token]);
    }
    SearchTags.item(index, true).set(m[index], txn);
  }
}

function getIndex(token) {
  token = token.normalize("NFKD").replace(/[\u0300-\u036F]/g, "");
  return token.slice(0, INDEX_SIZE);
}

let cache = new Map();
export function clearCache() {
  cache = new Map();
}
export async function* getSearchResults(tokens) {
  for (let token of tokens) {
    let key = getIndex(token);
    /** @type {import("@/models/lib/model_type_info").Item} */
    let item;
    if (cache.has(key)) {
      item = cache.get(key);
    } else {
      item = SearchTags.item(key);
      cache.set(key, item);
    }
    if (!item._isLoaded) {
      try {
        await item.load();
      } catch (e) {
        return;
      }
    }
    yield item[token.slice(INDEX_SIZE) || "-"];
  }
}

export const SearchIndex = new Model("search_index", IndexEntry, {
  [USES_EXACT_IDS]: true,
});
