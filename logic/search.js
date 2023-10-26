import {
  SearchIndex,
  SearchTags,
  getIndex,
  getSearchResults,
} from "@/models/search_index";
import { parseQuery } from "@/utils/createQuery";

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
  do {
    let tokens = bucket.splice(0, bucketSize);
    for await (let items of getSearchResults(tokens)) {
      if (!items) continue;
      results.push(
        items
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
