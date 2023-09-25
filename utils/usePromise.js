import { useMemo } from "react";
import { useState, useEffect, useRef } from "react";
export default function usePromise(createPromise, deps) {
  const [, setData] = useState({});
  const ref = useRef({});
  const cb = useMemo(
    function () {
      ref.current = undefined;
      return createPromise;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps]
  );
  useEffect(
    function () {
      let stale = false;
      const promise = cb();
      promise.then(function (data) {
        if (!stale) {
          if (data !== ref.current) {
            ref.current = data;
            setData({});
          }
        }
      });
      return function () {
        stale = true;
      };
    },
    [cb]
  );
  return ref.current;
}
