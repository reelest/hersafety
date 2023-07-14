import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { query, getDocs, onSnapshot } from "firebase/firestore";
import { firestore } from "@/logic/firebase_init";
import { useEffect, useRef, useState } from "react";
import createSubscription from "@/utils/createSubscription";
import useStable from "@/utils/useStable";

/**
 * @typedef {[string, import("firebase/firestore").WhereFilterOp, any]} FilterParam
 */
export class Model {
  constructor(collectionID, ItemClass = Item) {
    this.collectionID = collectionID;
    this.Item = ItemClass;
    this.converter = Model.converter(this);
  }
  static converter(model) {
    return {
      toFirestore: (item) => {
        return item.data();
      },
      /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
      fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new model.Item(snapshot.ref, data);
      },
    };
  }
  request(query) {
    return new MultiQuery(query.withConverter(this.converter));
  }
  all() {
    return this.request(query(collection(firestore, this.collectionID)));
  }
  /**
   * @param {...FilterParam} params
   */
  filter(...params) {
    return this.request(
      query(
        collection(firestore, this.collectionID),
        ...params.map(([key, op, val]) => where(key, op, val))
      )
    );
  }
  item(id) {
    return new this.Item(this.ref(id), this.Item.Empty);
  }
  create() {
    return new this.Item(this.ref(), this.Item.Empty);
  }
  ref(...id) {
    return doc(firestore, this.collectionID, ...id);
  }
}

class MultiQuery {
  constructor(query) {
    this.query = query;
  }
  async get() {
    return toItemArray(await getDocs(this.query));
  }
  watch(cb, onError = console.error) {
    return onSnapshot(this.query, {
      next(snapshot) {
        console.log(snapshot);
        cb(toItemArray(snapshot));
      },
      error(error) {
        onError?.(error);
      },
    });
  }
}
class DocumentQuery extends MultiQuery {
  async get() {
    return (await getDoc(this.query)).data();
  }
  watch(cb, onError = console.error) {
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

export function useQuery(createQuery, deps = [], { watch = false } = {}) {
  const dedupeIndex = useRef(0);
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
  });
  const getState = useStable(() => state);
  useEffect(
    () => sendQuery(dedupeIndex, getState, setState, watch, createQuery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watch, ...deps]
  );

  return state;
}

export function createSharedQuery(query, { watch = false }) {
  const dedupeIndex = { current: 0 };
  return createSubscription((setState) => {
    setState({
      data: null,
      error: null,
      loading: true,
    });
    let lastState;
    return sendQuery(
      dedupeIndex,
      () => lastState,
      (s) => {
        lastState = s;
        setState(s);
      },
      watch,
      () => query
    );
  });
}

const sendQuery = (dedupeIndex, getState, setState, watch, createQuery) => {
  const p = dedupeIndex.current;
  /**@type {MultiQuery} */
  const query = createQuery();
  setState({ loading: true, ...getState() });
  const onSuccess = (e) => {
    if (p === dedupeIndex.current)
      setState({ loading: false, data: e, error: null });
  };
  const onError = (e) => {
    if (p === dedupeIndex.current)
      setState({ loading: false, error: e, ...getState() });
  };
  if (watch) {
    query.get().then(onSuccess, onError);
  } else {
    return query.watch(onSuccess, onError);
  }
};

export class Item {
  static Empty = {};
  constructor(ref, data) {
    Object.defineProperty(this, "_ref", ref);
    Object.defineProperty(this, "_id", ref.id);
    Object.assign(this, data);
  }
  async save() {
    await updateDoc(this._ref, this);
  }
  async load() {
    Object.assign(this, await new DocumentQuery(this._ref).get());
  }
  async delete() {
    await deleteDoc(this._ref);
  }
  data() {
    return this;
  }
}

/**
 * @param {QuerySnapshot} ref
 */
const toItemArray = (snapshot) => {
  console.log({ snapshot });
  return snapshot.docs.map((e) => e.data());
};
