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
  async delete(id) {
    await deleteDoc(doc(firestore, this.collectionID, id));
  }
  async item(id) {
    return DocumentQuery(this.ref(id));
  }
  create() {
    return new this.Item(doc(firestore, this.collectionID), this.Item.Empty);
  }
  ref(id) {
    return doc(firestore, this.collectionID, id);
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
  const getState = useStable;
  useEffect(
    () => sendQuery(dedupeIndex, state, setState, watch, createQuery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watch, ...deps]
  );

  return state;
}

export function createSharedQuery(query) {
  const dedupeIndex = { current: 0 };
  return createSubscription((setState) => {
    setState({
      data: null,
      error: null,
      loading: true,
    });
    return sendQuery();
  });
}

const sendQuery = (dedupeIndex, state, setState, watch, createQuery) => {
  const p = dedupeIndex.current;
  /**@type {MultiQuery} */
  const query = createQuery();
  setState({ loading: true, ...state });
  const onSuccess = (e) => {
    if (p === dedupeIndex.current)
      setState({ loading: false, data: e, error: null });
  };
  const onError = (e) => {
    if (p === dedupeIndex.current)
      setState({ loading: false, error: e, ...state });
  };
  if (watch) {
    state.get().then(onSuccess, onError);
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
  return snapshot.docs.map((e) => e.data());
};
