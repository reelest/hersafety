import { useRef } from "react";
import useStable from "./useStable";
export default function mutex(func) {
  let mutex = false;
  return async (...args) => {
    if (mutex) return console.warn("Ignoring click due to mutex");
    try {
      mutex = true;
      return await func(...args);
    } finally {
      mutex = false;
    }
  };
}

export const useMutex = (e) => useStable(e, mutex);
