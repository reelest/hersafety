import deepEqual from "deep-equal";
import delay from "./delay";

/**
 * @template T
 *
 * @param {T} fn
 * @param {Function} compare
 * @returns {T}
 */
export default function pool(fn, compare = deepEqual, ttl = 1000) {
  const running = [];
  return async function (...args) {
    let x = running.find((e) => compare(e.args, args));
    if (!x) {
      try {
        x = { ret: fn(...args), args };
        running.push(x);
        return await x.ret;
      } finally {
        delay(ttl).then(() => running.splice(running.indexOf(x), 1));
      }
    }
    return await x.ret;
  };
}
