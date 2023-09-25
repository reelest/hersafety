import useStable from "./useStable";
export default function mutex(func) {
  let mutex = false;
  return async (...args) => {
    if (mutex) return console.debug("Ignoring function call due to mutex");
    try {
      mutex = true;
      return await func(...args);
    } finally {
      mutex = false;
    }
  };
}

export const useMutex = (e) => useStable(e, mutex);
