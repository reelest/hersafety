import { useCallback, useState } from "react";
import { useMemo } from "react";
import useListener from "./useListener";
import useWindowRef from "./useWindowRef";
import createSubscription from "./createSubscription";

const [useSignal, , dispatchSignal] = createSubscription();
dispatchSignal({});
export default function useLocalStorage(key) {
  const [tag, setTag] = useState(1);
  const windowRef = useWindowRef();
  const signal = useSignal();
  useListener(windowRef, "storage", () => setTag(tag + 1));
  return useMemo(
    () => tag && signal && windowRef.current && localStorage?.getItem?.(key),
    [key, windowRef, tag, signal]
  );
}
export function useSetLocalStorage(key) {
  const windowRef = useWindowRef();
  return useCallback(
    (value) => {
      if (windowRef.current) {
        windowRef.current.localStorage.setItem(key, value);
        dispatchSignal({});
      }
    },
    [windowRef, key]
  );
}
