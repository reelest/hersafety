/** Removes duplicates elements from a sorted array
 *  Usage: arr.sort.filter(uniq)
 */
export default function uniq(e, i, arr) {
  return i === 0 || arr[i - 1] !== e;
}
