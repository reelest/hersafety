export default function plural(m) {
  if (!m) return m;
  if (m.endsWith("s")) return m + "es";
  else return m + "s";
}

export function singular(m) {
  if (!m) return m;
  if (m.endsWith("s")) {
    m = m.slice(0, -1);
    if (m.endsWith("sse")) return m.slice(0, -1);
    return m;
  }
  return m;
}
