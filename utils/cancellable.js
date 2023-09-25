import { useCallback, useEffect, useRef, useState } from "react";
/**
 *
 * @param  initialData
 * @returns [data,setData,cancelled]
 */
export default function useCancellableState(m) {
  const [data, setData] = useState(m);
  const cancelled = useRef(false);
  useEffect(function () {
    return function () {
      cancelled.current = true;
    };
  }, []);
  return [
    data,
    useCallback(
      function (newData) {
        if (!cancelled.current) {
          setData(newData);
        }
      },
      [setData]
    ),
    cancelled,
  ];
}
