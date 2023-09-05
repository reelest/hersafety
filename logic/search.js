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
export async function* search(text, limit = 10, collections) {
  if (!text) return [];
  const query = SearchIndex.all().pageSize(limit);
  const tags = parseQuery(text);
  const bucketSize =
    collections && collections.length
      ? Math.min(10, Math.floor(30 / collections.length))
      : 10;
  let bucket = tags.shift();
  let results = [];
  do {
    let tokens = bucket.splice(0, bucketSize);
    await query.setFilter(
      "tokens",
      "array-contains-any",
      tokens,
      ...(collections ? ["collections", "array-contains-any", collections] : [])
    );

    let m = await query.get();
    while (m.length !== 0) {
      results.push(...m);
      if (results.length >= limit) {
        yield results;
        results = [];
      } else break;
      await query.advance();
      m = await query.get();
    }
    while (bucket.length === 0) {
      bucket = tags.shift();
      if (!bucket) break;
    }
  } while (bucket);
  return results;
}
const _id = (item) => item.uniqueName().replace(/\//g, "^");
const searchIndexer = Symbol();
async function updateInTxn(txn, item) {
  return txn.set(SearchIndex.ref(_id(item)), item[searchIndexer](item));
}
async function deleteInTxn(txn, item) {
  return txn.delete(SearchIndex.ref(_id(item)));
}

/**
 *
 * @param {String[]} props
 * @param {CountedItem} item
 * @returns
 */
export function createIndexEntry(props, item) {
  return {
    id: item.id(),
    collection: [item._model._ref.path],
    tokens: props
      .map((e) => String(item[e] ?? ""))
      .filter(Boolean)
      .map(parseQuery)
      .flat(2)
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
  props ,
  createIndex = createIndexEntry
) => {
  if(!props){
    const template = ite
    = Object.keys(new ItemClass().filter(e=>))
  }
  const indexer = (item) => createIndex(props, item);
  ItemClass.markTriggersUpdateTxn(props, false);
  ItemClass.prototype[searchIndexer] = indexer;
};
export function onSearchUpdateItem(item, txn) {
  updateInTxn(txn, item);
}
export function onSearchAddItem(item, txn) {
  updateInTxn(txn, item);
}
export function onSearchDeleteItem(item, txn) {
  deleteInTxn(txn, item);
}
