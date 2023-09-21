export default function pick(obj, keys) {
  return Object.keys(obj)
    .filter((e) => keys.includes(e))
    .reduce((arr, key) => ((arr[key] = obj[key]), arr), {});
}
