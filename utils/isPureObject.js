export default function isPureObject(e) {
  return !!e && typeof e === "object" && !Array.isArray(e);
}
