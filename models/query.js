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
import { noFirestore } from "./model";
import { range } from "d3";

export const DEFAULT_ORDERING = "!model-default-ordering";
export const DEFAULT_ORDERING_DESCENDING = "!model-default-descending";
export const SECONDARY_ORDERING = "!model-secondary-ordering";
export const SECONDARY_ORDERING_DESCENDING = "!model-secondary-descending";
/**
 * Firebase has no paging support.
 * The first instinct might be to store the ids in buckets but since sort order,
 * and filtering might change, I instead choose to use something similar to what
 * text editors use to synchronize text on the screen.
 */

export const toItemArray = (snapshot) => {
  return snapshot.docs.map((e) => e.data());
};

/**
 * Provides anchors for moving to the next page or going to the previous page
 */
class LocalCache {
  //When items which were in the window get removed, assume they were deleted
  //This is the only policy implemented for now.
  static ASSUME_DELETED_POLICY = 2;

  /** @type {Array<Item>} */
  data = [];
  start = 0;
  end = 0;
  _busy = null;
  /**
   * @param {QuerySnapshot} snapshot
   */
  _ensureLocked() {
    if (!this._busy)
      throw new Error("Cannot modify cache without acquiring lock");
  }
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
    return data;
  }
  _ensureUnique() {
    const store = this.data;
    const mid = store.slice(this.start, this.end).map((e) => e.id());
    let l = 0;
    for (let i = this.start - 1; i >= 0; i--) {
      if (store[i] && mid.includes(store[i].id())) {
        store.splice(i, 1);
        l++;
      }
    }
    this.setPage(this.start - l);
    for (let i = store.length - 1; i >= this.end; i--) {
      if (store[i] && mid.includes(store[i].id())) store.splice(i, 1);
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
    this.start = Math.min(start, this.data.length);
    this.end = Math.min(this.start + pageSize, this.data.length);
  }
  hasNextAnchor(start) {
    return start === 0 || this.data[start - 1];
  }
  nextAnchor(size) {
    console.assert(this.hasNextAnchor(this.start), "noAnchor");
    return this.start > 0
      ? [startAfter(this.data[this.start - 1]), limit(size)]
      : [];
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

  syncStart(start) {
    this._ensureLocked();

    const offset = this.start - start;
    if (offset > 0) {
      this.store.splice(0, offset);
    } else {
      this.store.splice(0, 0, ...range(offset).map(null));
    }
    this.setPage(start);
  }
  reset() {
    this._ensureLocked();
    this.data.length = 0;
    this.setPage(this.start);
  }
  size() {
    return this.data.length;
  }
  hasData() {
    return this.data.slice(this.start, this.end).find(Boolean);
  }

  async lock() {
    while (this._busy) await this._busy;
    let resume;
    this._busy = new Promise((_resume) => {
      resume = () => {
        this._busy = null;
        _resume();
      };
    });
    return resume;
  }

  async run(fn) {
    const resume = await this.lock();
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
async function runSanityChecks(query) {
  console.assert(query.cache.start <= query.cache.size(), "cache integrity");
  console.assert(query.cache.start === (await query.getIndex()), "page index");
  console.assert(query.cache.size() <= (await query.getCount()), "page size");
}

// async function assertQueryImmutable(query) {
//   const m = query._query;
//   return () => {
//     console.assert(query._query === m, "query immutability");
//   };
// }
const PAGE_DIRECTION_FORWARDS = 2;
const PAGE_DIRECTION_BACKWARDS = 1;
export class MultiQuery {
  _pageSize = 100;
  _pageDirection = PAGE_DIRECTION_FORWARDS;
  _filters = [];
  _orderBy = [];
  _onError = console.error;
  _unsubscribe = null;

  _query = null;
  constructor(model) {
    //Used for filtering
    this.model = model;
    this.cache = new LocalCache();

    // A subscription that notifies listeners when this query completes
    [, this._dispatch, this._subscribe] = createSubscription(() => {
      this.start();
      return () => this._unsubscribe(), (this._unsubscribe = null);
    });
    this.orderBy();
  }
  async get() {
    if (noFirestore) return [];

    if (this.isRunning()) {
      return await new Promise((r) => {
        const l = this._subscribe((e) => {
          l();
          r(e);
        });
      });
    } else if (!this.isRunning()) {
      const x = await this.cache.run(async () => {
        return this.cache.update(await getDocs(this.query));
      });
      this.restart();
      return x;
    }
  }
  watch(cb, onError) {
    if (noFirestore) return noop;
    if (onError) this._onError = onError;
    return this._subscribe(cb);
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

  // Construct a firebase query from this Query's state
  // Also, cache, _filters, _pageSize and _orderBy must only be changed using their respective methods.
  get query() {
    return noFirestore
      ? null
      : this._query ||
          (this._query = query(
            this.model._ref,
            ...this._filters,
            ...this._orderBy,
            ...(this._pageDirection === PAGE_DIRECTION_FORWARDS
              ? this.cache.nextAnchor(this._pageSize)
              : this.cache.prevAnchor(this._pageSize))
          ).withConverter(this.model.converter));
  }

  async getCount() {
    return await getCountFromServer(
      this.model._ref,
      ...this._filters,
      ...this._orderBy,
      limit(1000)
    );
  }

  async getIndex() {
    if (this.cache.size() === 0) return 0;
    if (
      this._pageDirection === PAGE_DIRECTION_FORWARDS &&
      this.cache.start === 0
    )
      return 0;
    await this.cache.run(async () => {
      const index = await getCountFromServer(
        query(
          this.model._ref,
          ...this._filters,
          ...this._orderBy,
          endBefore(this.data[this.cache.start - 1])
        ).withConverter(this.model.converter)
      );
      this.cache.syncStart(index);
      return index;
    });
  }

  start() {
    if (this.isRunning()) this._unsubscribe();
    runSanityChecks();
    const _unsubscribe = (this._unsubscribe = this.isBusy()
      ? noop
      : onSnapshot(this.query, {
          next: (snapshot) => {
            if (_unsubscribe === this._unsubscribe)
              this._dispatch(this.cache.update(snapshot));
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

  async goto(page) {
    const index = Math.max(page, 0) * this._pageSize;
    if (index === this.cache.start) return;
    if (
      index < this.cache.start
        ? this.cache.hasPrevAnchor(index + this._pageSize)
        : this.cache.hasNextAnchor(index)
    ) {
      if (index < this.cache.start)
        this._pageDirection = PAGE_DIRECTION_BACKWARDS;
      else this._pageDirection = PAGE_DIRECTION_FORWARDS;
      this.cache.run(() => {
        this.cache.setPage(index, this._pageSize);
      });
      this.restart();
    } else {
      this._pageDirection = PAGE_DIRECTION_FORWARDS;
      try {
        await this._bulkLoadUpTo(index);
      } finally {
        this.restart();
      }
    }
  }
  async _bulkLoadUpTo(targetSize) {
    let currentSize = this.cache.size();
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
        this.cache.await getDocs(m);
      });
      if (currentSize <= this.cache.size()) break;
      currentSize = this.cache.size();
    }
  }
  filter(key, op, val) {
    this._filters.push(where(key, op, val));
    this.cache.reset();
    this.restart();
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
    this.cache.reset();
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

export function useQuery(
  createQuery,
  deps = [],
  { watch = false, count = false, index = false } = {}
) {
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
    () =>
      sendQuery(
        dedupeIndex,
        getState,
        setState,
        { watch, count, index },
        createQuery
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watch, count, index, ...deps]
  );
  return state;
}
/**TODO stop: unsubscribing to save requests */

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

const sendQuery = (dedupeIndex, getState, setState, opts, createQuery) => {
  const p = ++dedupeIndex.current;
  /**@type {MultiQuery} */
  const query = createQuery();
  setState({ loading: true, ...getState() });
  const onSuccess = (e) => {
    console.log({ e, success: true, query });
    if (p === dedupeIndex.current)
      setState({ loading: false, data: e, error: null, ...getState() });
  };
  const onError = (e) => {
    console.log({ e, success: false, query });
    if (p === dedupeIndex.current)
      setState({ loading: false, error: e, ...getState() });
  };
  if (opts.count)
    query.getCount().then((x) => {
      if (p === dedupeIndex.current) setState({ count: x, ...getState() });
    });
  if (opts.index)
    query.getIndex().then((x) => {
      if (p === dedupeIndex.current) setState({ index: x, ...getState() });
    });
  if (opts.watch) {
    return query.watch(onSuccess, onError);
  } else {
    query.get().then(onSuccess, onError);
    return; //no callback
  }
};
