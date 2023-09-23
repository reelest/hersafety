import { useRef } from "react";
export default function useStable(func, wrapper = (e) => e) {
  const ref = useRef({
    cb: wrapper((...args) => ref.current.handler(...args)),
  });
  ref.current.handler = func;
  return func && ref.current.cb;
}
