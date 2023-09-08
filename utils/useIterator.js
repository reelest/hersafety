import { useState, useEffect } from "react";
import useStable from "./useStable";
import { useMutex } from "./mutex";

const NEW_TOKEN = (prevToken) => ({
  token: prevToken.token + 1,
});
const OLD_TOKEN = (prevToken) => ({ token: prevToken.token });

/**
 * @template T
 * @typedef {{
 * done: boolean,
 * error?: Error,
 * loading: boolean,
 * loadMore: () => void,
 * value: T[],
 * }} UseIterator<T>
 */
/**
 * @template T
 * @param {AsyncGenerator<T[],T[],void>} iterator
 * @returns {UseIterator<T>}
 */
export default function useIterator(iterator) {
  // The results accumulated from the iterator
  const [results, setResults] = useState({
    done: false,
    error: null,
    loading: false,
    loadMore,
    value: [],
  });
  const [refreshToken, refresh] = useState({ token: 0 });

  const loadMore = useStable(() => refresh(OLD_TOKEN));
  useEffect(() => {
    setResults({
      done: false,
      error: null,
      loading: false,
      loadMore,
      value: [],
    });
    refresh(NEW_TOKEN);
  }, [iterator, loadMore]);

  const isRefreshStillValid = useStable(
    (e) => refreshToken.token === e.token || (refresh(OLD_TOKEN) && false)
  );

  const doUpdate = useMutex(async () => {
    if (results.done) return;
    const x = refreshToken;
    setResults({ ...results, loading: true });
    try {
      const { done, value } = await iterator.next();
      if (isRefreshStillValid(x))
        setResults({
          done,
          error: false,
          loading: false,
          loadMore,
          value: results.value.concat(value ?? []),
        });
    } catch (e) {
      if (isRefreshStillValid(x))
        setResults({
          done: false,
          error: e,
          loading: false,
          loadMore,
          value: results.value,
        });
    }
  });
  useEffect(() => {
    doUpdate();
  }, [refreshToken, doUpdate]);

  return results;
}
