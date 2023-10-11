import { SearchIndex } from "@/models/search_index";
import { parseQuery } from "@/utils/createQuery";

/**
 *
 * @param {String} text
 * @param {number} limit
 * @returns
 */
export async function* search(text, filters, limit = 10) {
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
      tokens
      // ...(filters ? ["filters", "array-contains-any", filters] : [])
    );
    for await (const m of query.iterator()) {
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
  yield results;
}
