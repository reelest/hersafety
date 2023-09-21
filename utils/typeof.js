export default function typeOf(value) {
  const p = typeof value;
  if (p !== "object") return p;
  if (value === null) return "null";
  if ("constructor" in value) return value.constructor.name.toLowerCase();
  return "object";
}
