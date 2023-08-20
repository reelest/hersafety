import {
  getDoc,
  where,
  query,
  getDocs,
  onSnapshot,
  orderBy,
  startAfter,
  limit,
  endBefore,
  limitToLast,
  getCountFromServer,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import createSubscription from "@/utils/createSubscription";
import useStable from "@/utils/useStable";
import { noop } from "@/utils/none";
import { Model, noFirestore } from "./model";
import { range } from "d3";
import usePromise from "@/utils/usePromise";
import useRefresher from "@/utils/useRefresher";
import usePager from "@/utils/usePager";

export const DEFAULT_ORDERING = "!model-default-ordering";
export const DEFAULT_ORDERING_DESCENDING = "!model-default-descending";
export const SECONDARY_ORDERING = "!model-secondary-ordering";
export const SECONDARY_ORDERING_DESCENDING = "!model-secondary-descending";
/**
 * Firebase has no paging support.
 * The first instinct might be to data the ids in buckets but since sort order,
 * and filtering might change, I instead choose to use something similar to what
 * text editors use to synchronize text on the screen.
 *
 * @typedef {import("firebase/firestore").QuerySnapshot} QuerySnapshot
 * @typedef {import("firebase/firestore").QueryDocumentSnapshot} QueryDocumentSnapshot
 */

/**
 * Provides anchors for moving to the next page or going to the previous page
 */
class LocalCache {
  //When items which were in the window get removed, assume they were deleted
  //This is the only policy implemented for now.
  static ASSUME_DELETED_POLICY = 2;

  /** @type {Array<QueryDocumentSnapshot>} */
  data = [];
  start = 0;
  end = 0;
  _busy = null;

  _ensureLocked() {
    if (!this._busy)
      throw new Error("Cannot modify cache without acquiring lock");
  }

  /**
   *
   * @param {QuerySnapshot} snapshot
   * @param {number} policy
   * @returns
   */
  update(snapshot, policy = LocalCache.ASSUME_DELETED_POLICY) {
    if (policy !== LocalCache.ASSUME_DELETED_POLICY)
      throw new Error("Unknown policy passed to LocalCache.update");
    this._ensureLocked();
    const data = snapshot.docs;
    this.data.splice(
      this.start,
      policy === LocalCache.ASSUME_DELETED_POLICY ? this.end - this.start : 0,
      ...data
    );
    this.end = this.start + data.length;
    this._ensureUnique();
    return this.get();
  }

  _ensureUnique() {
    const data = this.data;
    const mid = data.slice(this.start, this.end).map((e) => e.id);
    let l = 0;
    for (let i = this.start - 1; i >= 0; i--) {
      if (data[i] && mid.includes(data[i].id)) {
        data.splice(i, 1);
        l++;
      }
    }
    this.setPage(this.start - l);
    for (let i = data.length - 1; i >= this.end; i--) {
      if (data[i] && mid.includes(data[i].id)) data.splice(i, 1);
    }
  }
  /**
   * @returns {Array<import("./model").Item>}
   */
  get() {
    return this.data
      .slice(this.start, this.end)
      .filter(Boolean)
      .map((e) => e.data());
  }

  setPage(start, pageSize = this.end - this.start) {
    this._ensureLocked();
    this.start = start;
    this.end = Math.min(this.start + pageSize, this.data.length);
    console.assert(
      this.hasNextAnchor(this.start) || this.hasPrevAnchor(this.end),
      "current page must have an anchor for retrieving data"
    );
  }
  hasNextAnchor(start) {
    return start === 0 || this.data[start - 1];
  }
  nextAnchor(size) {
    console.assert(this.hasNextAnchor(this.start), "noAnchor");
    return this.start > 0
      ? [startAfter(this.data[this.start - 1]), limit(size)]
      : [limit(size)];
  }
  hasPrevAnchor(end) {
    return this.data[end];
  }
  prevAnchor(size) {
    console.assert(this.hasPrevAnchor(this.end), "noAnchor");
    return this.data[this.end]
      ? [endBefore(this.data[this.end]), limitToLast(size)]
      : null;
  }
  closestAnchor(start) {
    while (!this.hasNextAnchor(start)) start -= 1;
    return start;
  }

  syncStart(start) {
    this._ensureLocked();

    const offset = this.start - start;
    if (offset > 0) {
      this.data.splice(0, offset);
    } else {
      this.data.splice(0, 0, ...range(offset).map(null));
    }
    this.setPage(start);
  }
  async reset() {
    await this.run(() => {
      this.data.length = 0;
      this.setPage(0);
    });
  }
  size() {
    return this.data.length;
  }
  hasData() {
    return this.data.slice(this.start, this.end).some(Boolean);
  }

  async run(fn) {
    while (this._busy) await this._busy;
    let resume;
    this._busy = new Promise((_resume) => {
      resume = () => {
        this._busy = null;
        _resume();
      };
    });
    try {
      return await fn();
    } finally {
      resume();
    }
  }
}

/**
 *
 * @param {MultiQuery} query
 */

const PAGE_DIRECTION_FORWARDS = 2;
const PAGE_DIRECTION_BACKWARDS = 1;
export class MultiQuery {
  _pageSize = 2;
  _currentPage = 0;
  _scrollDirection = PAGE_DIRECTION_FORWARDS;
  _filters = [];
  _orderBy = [];
  _onError = console.error;
  _unsubscribe = null;
  _count = 0;
  _query = null;
  /**
   *
   * @param {Model} model
   */
  constructor(model) {
    //Used for filtering
    this.model = model;
    this.cache = new LocalCache();
    console.trace("Creating query " + model._ref.path);
    // A subscription that notifies listeners when this query completes
    [, this._subscribe, this._dispatch] = createSubscription(() => {
      console.log("Starting subscriptions");
      this.start();
      return () => {
        this._unsubscribe();
        this._unsubscribe = null;
      };
    });
    this.cache.run(() => this.orderBy());
  }
  // Construct a firebase query from this Query's state
  // Also, the cache, _filters, _pageSize and _orderBy must only be changed using their respective methods.
  get query() {
    return noFirestore
      ? null
      : this._query ||
          (this._query = query(
            this.model._ref,
            ...this._filters,
            ...this._orderBy,
            ...(this._scrollDirection === PAGE_DIRECTION_FORWARDS
              ? this.cache.nextAnchor(this._pageSize)
              : this.cache.prevAnchor(this._pageSize))
          ).withConverter(this.model.converter));
  }

  // A Query can be in one of 4 states: stopped, stopped-busy, running, running-busy
  // A query starts running once it has at least one listener
  isRunning() {
    return this._unsubscribe !== null;
  }
  // A query gets busy when it is trying to jump to a new page
  isBusy() {
    return this.cache._busy !== null;
  }

  // Data retrieval methods
  async get() {
    if (noFirestore) return [];

    if (this.isRunning()) {
      return await new Promise((r) => {
        // Get from cache
        const l = this._subscribe((e) => {
          l();
          r(e);
        });
      });
    } else {
      const x = await this.cache.run(async () => {
        return this.cache.update(await getDocs(this.query));
      });
      // Restart subscription just in case a listener subscribed while this was running.
      // This could unintentionally resume a paused subscription ie
      // Such as while _bulkLoading but the probability is likely low
      this.restart();
      return x;
    }
  }
  watch(cb, onError) {
    if (noFirestore) return noop;
    if (onError) this._onError = onError;
    return this._subscribe(cb);
  }

  start() {
    if (this.isRunning()) this._unsubscribe();
    console.log("Restarting snapshot");
    const _unsubscribe = (this._unsubscribe = this.isBusy()
      ? noop
      : onSnapshot(this.query, {
          next: (snapshot) => {
            if (_unsubscribe === this._unsubscribe) {
              this.cache.run(() => this._dispatch(this.cache.update(snapshot)));
            }
          },
          error: (error) => {
            this._onError?.(error);
          },
        }));
    if (this.cache.hasData()) this._dispatch(this.cache.get());
  }
  restart() {
    this._query = null;
    if (this.isRunning()) this.start();
  }

  async seek(index) {
    if (typeof index !== "number" || index < 0)
      throw new Error("Invalid index: " + index + " supplied");
    if (index === this.cache.start) return;
    if (
      index < this.cache.start && index !== 0
        ? this.cache.hasPrevAnchor(index + this._pageSize)
        : this.cache.hasNextAnchor(index)
    ) {
      if (index < this.cache.start && index > this.cache.start - this._pageSize)
        this._scrollDirection = PAGE_DIRECTION_BACKWARDS;
      else this._scrollDirection = PAGE_DIRECTION_FORWARDS;
      await this.cache.run(() => {
        this.cache.setPage(index, this._pageSize);
      });
      this.restart();
    } else {
      try {
        await this._bulkLoadUpTo(index);
      } finally {
        this.restart();
      }
    }
  }

  async _bulkLoadUpTo(targetSize) {
    this._scrollDirection = PAGE_DIRECTION_FORWARDS;
    let currentSize = this.cache.closestAnchor(targetSize);
    while (currentSize < targetSize) {
      await this.cache.run(async () => {
        this.restart(); //stops any subscriptions
        let prevPageSize = this._pageSize;
        this._pageSize = Math.min(
          targetSize - currentSize,
          this._pageSize * 10
        );
        this.cache.setPage(currentSize);
        let m = this.query;
        this._pageSize = prevPageSize;
        this.cache.update(await getDocs(m));
      });
      // TODO allow cancellation or something
      const m = this.cache.closestAnchor(targetSize);
      if (currentSize <= m) break;
      currentSize = m;
    }
  }

  // Pager methods
  get page() {
    return Math.floor(this.cache.start / this._pageSize);
  }
  async getCount(max) {
    return await this.cache.run(async () => {
      return (this._count = await getCountFromServer(
        query(
          this.model._ref,
          ...this._filters,
          ...this._orderBy,
          ...(isNaN(max) ? [] : [max(Number(max) + 1)])
        )
      ));
    });
  }
  get sentinelValue() {
    return this.cache.data[this.cache.end - 1];
  }
  /**
   * Returns the first document after the last item if any
   */
  sentinel(cb, watch = true) {
    console.debug(`${watch ? "Watching" : "Reading"} for new values`);
    const m = this.sentinelValue;
    const _query = query(
      this.model._ref,
      ...this._filters,
      ...this._orderBy,
      startAfter(m),
      limit(1)
    );
    if (watch)
      return onSnapshot(_query, {
        next: (snapshot) => {
          cb(snapshot.docs[0]);
        },
        error: this._onError,
      });
    else getDocs(_query).then((snapshot) => cb(snapshot.docs[0]));
  }
  /**
   * Synchronize the current page. This method also resets backward pagination.
   * usePagedQuery does this automatically.
   */
  async syncIndex() {
    if (this.cache.size() === 0) return 0;
    if (
      this._scrollDirection === PAGE_DIRECTION_FORWARDS &&
      this.cache.start === 0
    )
      return 0;
    this.cache.run(async () => {
      const index = await getCountFromServer(
        query(
          this.model._ref,
          ...this._filters,
          ...this._orderBy,
          endBefore(this.cache.data[this.cache.start - 1])
        )
      );
      this.cache.syncStart(index);
    });
  }

  // Constructor methods
  filter(key, op, val) {
    this._filters.push(where(key, op, val));
    this.cache.reset().then(() => this.restart());
    return this;
  }
  orderBy(key, descending, secondKey, secondDescending) {
    key = key ?? this.model.Meta[DEFAULT_ORDERING];
    descending =
      descending ?? this.model.Meta[DEFAULT_ORDERING_DESCENDING] ?? false;
    secondKey = secondKey ?? this.model.Meta[SECONDARY_ORDERING];
    secondDescending =
      secondDescending ??
      this.model.Meta[SECONDARY_ORDERING_DESCENDING] ??
      false;
    this._orderBy = [];
    if (key) {
      this._orderBy.push(orderBy(key, descending ? "asc" : "desc"));
    }
    if (secondKey)
      this._orderBy.push(orderBy(secondKey, secondDescending ? "asc" : "desc"));
    this.cache.reset().then(() => this.restart());
    return this;
  }
  pageSize(size) {
    this._pageSize = size;
    this.restart();
    return this;
  }
}

export class DocumentQuery {
  constructor(query) {
    this.query = query;
  }
  async get() {
    if (noFirestore) return;
    return (await getDoc(this.query)).data();
  }
  watch(cb, onError = console.error) {
    if (noFirestore) return noop;
    return onSnapshot(this.query, {
      next(snapshot) {
        cb(snapshot.data());
      },
      error(error) {
        onError?.(error);
      },
    });
  }
}

export function usePagedQuery(
  createQuery,
  deps = [],
  { count: _defaultCount, ...opts }
) {
  const {
    _query: query,
    data,
    loading,
    ...rest
  } = useQuery(createQuery, deps, opts);

  //Get count of items
  const [countChanged, updateCount] = useRefresher();
  const count =
    usePromise(
      async () => (query ? _defaultCount ?? (await query.getCount()) : 0),
      [query, countChanged, _defaultCount]
    ) ?? Number.MAX_SAFE_INTEGER;

  // Track current page
  const pager = usePager(
    {
      length: count,
      slice() {
        return data;
      },
    },
    query?._pageSize ?? 1
  );
  const { page, goto } = pager;

  // Sync query with page
  // Sync current page before going to the first page
  useEffect(() => {
    if (query) {
      if (page === 0 && query.page === 1)
        query.syncCurrentPage().then(() => {
          const x = query.cache.start;
          if (x === query._pageSize) {
            query.seek(0);
          } else {
            goto(query.page);
            updateCount();
          }
        });
      else query.seek(page * query._pageSize);
    }
  }, [page, query, goto, updateCount]);

  // Update count when on the last page
  const isOnLastPage =
    query && query.page === Math.floor(count / query._pageSize);
  const sentinelValue = query?.sentinelValue;
  useEffect(() => {
    if (query && isOnLastPage && data.length === query._pageSize) {
      return query.sentinel((e) => {
        if (e) updateCount();
      }, opts.watch);
    }
  }, [
    isOnLastPage,
    updateCount,
    query,
    data?.length,
    sentinelValue,
    opts.watch,
  ]);

  return { data, loading, pager, ...rest };
}
export function useQuery(createQuery, deps = [], { watch = false } = {}) {
  const dedupeIndex = useRef(0);
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
    count: 0,
    index: 0,
  });
  const getState = useStable(() => state);

  useEffect(
    () => sendQuery(dedupeIndex, getState, setState, watch, createQuery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watch, ...deps]
  );
  return state;
}

/**TODO stop: unsubscribing  shared queries to save requests */
export function createSharedQuery(query, { watch = false } = {}) {
  const dedupeIndex = { current: 0 };
  return createSubscription(
    (setState) => {
      let lastState;
      return sendQuery(
        dedupeIndex,
        () => lastState,
        (s) => {
          lastState = s;
          setState(s);
        },
        { watch },
        () => query
      );
    },
    {
      data: null,
      error: null,
      loading: true,
    }
  );
}

const sendQuery = (dedupeIndex, getState, setState, watch, createQuery) => {
  const p = ++dedupeIndex.current;
  /**@type {MultiQuery} */
  const query = createQuery();
  setState({ ...getState(), loading: true, _query: query });
  if (!query) return;
  const onSuccess = (e) => {
    console.log({ e, success: true, query });
    if (p === dedupeIndex.current)
      setState({ ...getState(), loading: false, data: e, error: null });
    else console.log("Ignored result because query cahnged");
  };
  const onError = (e) => {
    console.log({ e, success: false, query });
    if (p === dedupeIndex.current)
      setState({ ...getState(), loading: false, error: e });
    else console.log("Ignored result because query cahnged");
  };
  if (watch) {
    return query.watch(onSuccess, onError);
  } else {
    query.get().then(onSuccess, onError);
    return; //no callback
  }
};
