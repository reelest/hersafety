import { SearchIndex } from "@/models/search_index";
import { parseQuery } from "@/utils/createQuery";
import uniq from "@/utils/uniq";
/**
 * @typedef {import("../models/lib/counted_model").CountedItem} CountedItem
 */
/**
 *
 * @param {String} text
 * @param {number} limit
 * @returns
 */
export async function* search(text, limit = 10, filters) {
  if (!text) return [];
  const query = SearchIndex.all().pageSize(limit);
  const tags = parseQuery(text);
  const bucketSize =
    filters && filters.length
      ? Math.min(10, Math.floor(30 / filters.length))
      : 10;
  let bucket = tags.shift();
  let results = [];
  do {
    let tokens = bucket.splice(0, bucketSize);
    await query.setFilter(
      "tokens",
      "array-contains-any",
      tokens,
      ...(filters ? ["filters", "array-contains-any", filters] : [])
    );

    for (const m of query.iterator()) {
      results.push(...m);
      if (results.length >= limit) {
        yield results;
        results = [];
      } else break;
    }
    while (bucket.length === 0) {
      bucket = tags.shift();
      if (!bucket) break;
    }
  } while (bucket);
  return results;
}
const _id = (item) => item.uniqueName().replace(/\//g, "^");
const indexCreator = Symbol();
async function updateInTxn(txn, item) {
  return SearchIndex.item(_id(item)).set(await item[indexCreator](item), txn);
}
async function deleteInTxn(txn, item) {
  return SearchIndex.item(_id(item)).delete(txn);
}

/**
 *
 * @param {String[]} props
 * @param {CountedItem} item
 * @param {CountedItem} state
 * @returns
 */
export function createIndexEntry(props, item, state, prev) {
  return {
    title: prev ? prev.title : "",
    description: prev ? prev.description : "",
    avatar: prev ? prev.avatar : "",
    image: prev ? prev.image : "",
    filters: [item.model()._ref.path]
      .concat(prev ? prev.filters : [])
      .filter(uniq),
    tokens: props
      .map((e) => String(state[e] ?? ""))
      .filter(Boolean)
      .map(parseQuery)
      .flat(2)
      .concat(prev ? prev.tokens : [])
      .filter(uniq),
  };
}

/**
 *
 * @param {Array<String>} props
 * @param {typeof import("../models/lib/counted_model").CountedItem} ItemClass
 */
export const indexForSearch = (
  ItemClass,
  props,
  createIndex = createIndexEntry
) => {
  const prev = ItemClass.prototype[indexCreator];
  const indexer = (item, state) =>
    createIndex(props, item, state, prev?.(item, state));
  ItemClass.markTriggersUpdateTxn(props, false);
  ItemClass.prototype[indexCreator] = indexer;
};

export async function onSearchUpdateItem(item, txn, newState) {
  await updateInTxn(txn, item, newState);
}
export async function onSearchAddItem(item, txn, newState) {
  await updateInTxn(txn, item, newState);
}
export async function onSearchDeleteItem(item, txn) {
  await deleteInTxn(txn, item);
}
