import { SearchIndex } from "@/models/search_index";
import { parseQuery } from "@/utils/createQuery";
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
      }
      await query.advance();
      m = await query.get();
    }
    while (bucket && bucket.length === 0) bucket = tags.shift();
  } while (bucket);
  return results;
}
