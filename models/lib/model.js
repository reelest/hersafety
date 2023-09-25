import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/logic/firebase_init";
import { InvalidState, ItemDoesNotExist, checkError } from "./errors";
import getModelTypeInfo from "./model_type_info";
import pick from "@/utils/pick";
import { DocumentQueryCursor, QueryCursor } from "./query";
import Txn from "./transaction";
import isPureObject from "@/utils/isPureObject";
import typeOf from "@/utils/typeof";
import hasProp from "@/utils/hasProp";
import { isUpdateValue } from "./update_value";
/**
 * (new|(?<!Model )extends) \w*Model\b
 */
/**
 * @typedef {import("firebase/firestore").WhereFilterOp} WhereFilterOp
 */
export const noFirestore = firestore === null;
export const USES_EXACT_IDS = "!uses-exact-ids";
/**
 * @template T
 * @typedef {{new(): T}} Class
 */
/**
 * @template {Item} T
 */
export class Model {
  _Item;
  /**
   * @param {string} _collectionID
   * @param {Class<T>} [ItemClass=Item]
   * @param {Partial<import("./model_type_info").ModelTypeInfo>} meta
   */
  constructor(_collectionID, ItemClass = Item, meta) {
    this._ref = noFirestore
      ? { path: _collectionID }
      : collection(firestore, _collectionID);
    this._Item = ItemClass ?? Item;
    this.Meta = this.Meta ?? getModelTypeInfo(this, meta);
    this.converter = Model.converter(this);
    global[_collectionID + "Model"] = this;
  }
  static converter(model) {
    return {
      toFirestore: (item) => {
        return item.data();
      },
      /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
      fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const x = new model._Item(snapshot.ref, false, model);
        x.setData(data);
        x._isLoaded = true;
        x.onCreate();
        return x;
      },
    };
  }
  request() {
    return new QueryCursor(this);
  }
  all() {
    return this.request();
  }
  /**
   * @template {keyof T} V
   * @param {V} key
   * @param {WhereFilterOp} op
   * @param {T[V]} val
   * @param {Array<V|WhereFilterOp|T[V]>} params
   */
  withFilter(key, op, val, ...params) {
    return this.all().setFilter(key, op, val, ...params);
  }
  /**
   * Use `useFastUpdate` for updating a element using set merge:true instead of update. This allows an element to be created on first update. But such an item can only be updated in transactions to avoid storage leaks e.g item deleted then updated.
   * @param {string} id
   * @param {boolean} useFastUpdate
   * @returns {T}
   */
  item(id, useFastUpdate) {
    const x = new this._Item(this.ref(id), false, this);
    if (useFastUpdate) x._useFastUpdate = useFastUpdate;
    x.onCreate();
    return x;
  }
  /**
   * @param {string} id
   * @param {(item: T, txn: Txn)=> Promise<void>} init
   * @returns {Promise<T>}
   */

  async getOrCreate(
    id,
    init = async (item, txn) => {
      if (item.isLocalOnly()) await item.save(txn);
    }
  ) {
    if (!this.Meta[USES_EXACT_IDS]) {
      throw new InvalidState(
        this.uniqueName() + " is not configured to use exact ids."
      );
    }
    return Txn.run(async (txn) => {
      //TODO - this can lead to unnecessary transaction retries
      const m = new this._Item(this.ref(id), true, this);
      try {
        await m.load(txn);
      } catch (e) {
        checkError(e, ItemDoesNotExist);
      }
      if (!m.isLocalOnly()) txn.ignorePreviousReads();
      m.onCreate();
      await init(m, txn);
      txn.onCommit(() => {
        if (m.isLocalOnly()) m._isCreated = false; //Prevent saving outside of this transaction
      });
      return m;
    });
  }
  /**
   * @returns {T}
   */
  create() {
    if (this.Meta[USES_EXACT_IDS])
      throw new InvalidState(
        this.uniqueName() + " is configured to use exact ids."
      );
    const x = new this._Item(this.ref(), true, this);
    x.onCreate();
    return x;
  }
  ref(...id) {
    return noFirestore
      ? { path: "server-side", id: "server-side" }
      : doc(this._ref, ...id);
  }
  uniqueName() {
    return this._ref.path;
  }
}

/**
 * @class
 * @property {import("firebase/firestore").DocumentReference} _ref
 */
export class Item {
  /*
    An item can only be created on the server if one of two conditions are met.
    1. #isLocalOnly is established either by create of by getOrCreate
    2. _useFastUpdate is enabled
  */
  #isLocalOnly;
  constructor(ref, isNew, model) {
    this.#isLocalOnly = !!isNew;
    Object.defineProperties(this, {
      _ref: { value: ref },
      _model: { value: model },
      _isLoaded: {
        writable: true,
        value: !!isNew,
      },
      _useFastUpdate: {
        writable: true,
        value: false,
      },
      _isCreated: {
        writable: true,
        value: false,
      },
    });
  }
  static empty() {
    return new this();
  }
  /**
   * Related method is Model.getOrCreate which automatically loads and optionally creates the item if it does not exist.
   */
  async load(txn) {
    const data = await this.read(txn);
    if (data === undefined) {
      throw new ItemDoesNotExist(this);
    }
    this.setData(data);
    this._isLoaded = true;
    if (this.#isLocalOnly) this.#isLocalOnly = false;
    return this;
  }
  /*
    Used for creating and overwriting documents in firestore.
  */
  async save(txn) {
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (!this._isCreated)
      throw InvalidState("Cannot save item that is not initialized.");
    if (this.#isLocalOnly) {
      // We add merge:true here to handle Metadata and SchoolData's unique case (non-unique uids).
      // Might refactor out later
      if (txn) {
        await txn.set(this._ref, this.data(), { merge: true });
        txn.onCommit(() => {
          this.#isLocalOnly = false;
        });
      } else {
        console.trace("Setting...");
        await setDoc(this._ref, this.data(), { merge: true });
        this.#isLocalOnly = false;
      }
    } else await this._update(txn, this.data());
  }
  /*
    Used for partial updates which do not require a rereading a document. Usually used with Model.item(id).
  */
  /**
   *
   * @param {Record<keyof ThisParameterType, any>} data
   * @param {*} txn
   */
  async set(data, txn) {
    if (noFirestore) throw InvalidState("No Firestore!!");

    //needed especially to trigger update transactions
    this.setData(data);
    if (this.#isLocalOnly) {
      await this.save(txn);
    } else await this._update(txn, data);
  }

  async _update(txn, data) {
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (!this._isCreated)
      throw InvalidState("Cannot save item that is not initialized.");
    if (this._useFastUpdate) {
      if (!txn)
        throw new InvalidState("Fast updates can only be done in transactions");
      await txn.set(this._ref, data, { merge: true });
    } else {
      data = flattenUpdate(data);
      if (txn) txn.update(this._ref, data);
      else await updateDoc(this._ref, data);
    }
  }
  // Deleting a document does not make it local only. Other clients might have copies of it.
  // While they currently, none should be able to update it,
  // if restoration was made possible by marking it as local only,
  // each client would be able to restore potentially conflicting versions of the same document.
  async delete(txn) {
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (txn) txn.delete(this._ref);
    else await deleteDoc(this._ref);
  }

  data() {
    if (!this._isLoaded || !this._isCreated)
      throw new InvalidState("Cannot read document that is not loaded");
    return Object.assign({}, this);
  }
  setData(d) {
    let copy;
    const isCompatible = (key) => {
      const val = d[key],
        valueType = typeOf(val),
        expectedType = typeOf(this[key]);
      if (valueType === expectedType) return true;
      if (!copy) copy = Object.assign({}, d);
      if (valueType === "timestamp" && expectedType === "date") {
        copy[key] = val.toDate();
      } else if (
        isUpdateValue(val) &&
        (expectedType === "array" ||
          expectedType === "number" ||
          expectedType === "date")
      ) {
        return true; //Allow this for now.
      } else if (
        valueType === "string" &&
        expectedType === "number" &&
        !isNaN(val)
      ) {
        copy[key] = Number(val);
        return true;
      } else if (valueType === "number" && expectedType === "date") {
        copy[key] = new Date(val);
      } else if (
        valueType === "string" &&
        expectedType === "date" &&
        !Number.isNaN(Date.parse(val))
      ) {
        copy[key] = new Date(val);
      } else {
        console.warn(
          "Ignored attempt to supply invalid data for " +
            this.model()?.uniqueName?.() +
            "." +
            key +
            " " +
            expectedType +
            " is not compatible with " +
            valueType +
            " value =",
          val,
          "."
        );
        return false;
      }
      return true;
    };
    // Run this first to obtain copy if necessary
    const validKeys = Object.keys(this).filter(
      (e) => hasProp(d, e) && isCompatible(e)
    );
    Object.assign(this, pick(copy ?? d, validKeys));
  }
  asQuery() {
    return new DocumentQueryCursor(this._ref);
  }
  isLocalOnly() {
    return this.#isLocalOnly;
  }
  id() {
    return this._ref.id;
  }
  /**
   * @returns {Model<typeof this>}
   */
  model() {
    return this._model;
  }
  uniqueName() {
    return this._ref.path;
  }

  getPropertyLabel(name) {
    return this.model().Meta[name].options.find((e) => e.value === this[name])
      .label;
  }
  /**
   * @private
   */
  onCreate() {
    this._isCreated = true;
  }
  async read(txn) {
    if (txn) return (await txn.get(this._ref)).data();
    else return await this.asQuery().get();
  }
}

function flattenUpdate(e, prefix = "", ctx = {}) {
  if (Object.keys(e).length === 0) {
    if (prefix) ctx[prefix.slice(0, -1)] = e;
  } else {
    Object.keys(e).forEach((k) =>
      isPureObject(e[k]) && !isUpdateValue(e[k])
        ? flattenUpdate(e[k], prefix + k + ".", ctx)
        : (ctx[prefix + k] = e[k] === undefined ? deleteField() : e[k])
    );
  }
  return ctx;
}
