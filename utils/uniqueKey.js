const map = new WeakMap();
export default function uniqueKey(e) {
  if (typeof e !== "object" || e === null) return e;
  if (map.has(e)) return map.get(e);
  map.set(e, Math.floor(Math.random() * 1000000000));
  return map.get(e);
}
