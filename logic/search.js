import { ItemDoesNotExist, checkError } from "@/models/lib/errors";
import { SearchIndex, SearchTags, getIndex } from "@/models/search_index";
import { parseQuery } from "@/utils/createQuery";

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
        try {
          checkError(e, ItemDoesNotExist);
        } catch (e) {
          console.error(e);
        }
        continue;
      }
    }
    yield item[token.slice(key.length) || "-"];
  }
}

/**
 *
 * @param {String} text
 * @param {number} limit
 * @returns any
 */
export async function* search(text, filters, limit = 10) {
  if (!text) return [];
  const tags = parseQuery(text);
  const bucketSize = Math.min(10, Math.floor(30 / filters.length));
  let bucket = tags.shift();
  let results = [];
  const unique = new Set();
  do {
    let tokens = bucket.splice(0, bucketSize);
    if (!bucket.length) bucket = tags.shift();
    for await (let items of getSearchResults(tokens)) {
      if (!items) continue;
      results.push(
        ...items
          .filter((e) => !unique.has(e) && unique.add(e))
          .map((e) => SearchIndex.item(e).getItem())
          .filter((e) =>
            filters.length
              ? true
              : "matchFilter" in e
              ? e.matchFilter(e)
              : false
          )
      );
      if (results.length >= limit) {
        yield results;
        results = [];
      }
    }
  } while (bucket);
  yield results;
}
