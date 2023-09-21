import { useRef } from "react";
/**
 * Wraps a function that changes every render with a stable reference that does not trigger updates in dependency arrays
 * @returns {Function} stable_callback
 */
export default function useStable(func, wrapper = (e) => e) {
  const ref = useRef({
    cb: wrapper((...args) => ref.current.handler(...args)),
  });
  ref.current.handler = func;
  return func && ref.current.cb;
}
