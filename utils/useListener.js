import { useRef, useEffect } from "react";
export default function useListener(ref, event, _handler, opts) {
  const handler = useRef();
  handler.current = _handler;
  useEffect(
    function () {
      if (ref.current) {
        const el = ref.current;
        const cb = function () {
          handler.current.apply(this, arguments);
        };
        el.addEventListener(event, cb, opts);
        return function () {
          el.removeEventListener(event, cb, opts);
        };
      }
    },
    [ref, event, opts]
  );
}
