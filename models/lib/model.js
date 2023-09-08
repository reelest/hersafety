import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { firestore } from "@/logic/firebase_init";
import { InvalidState, ItemDoesNotExist, checkError } from "./errors";
import getModelTypeInfo from "./model_type_info";
import pick from "@/utils/pick";
import { DocumentQueryCursor, QueryCursor } from "./query";
import { noop } from "@/utils/none";
/**
 * @typedef {import("firebase/firestore").WhereFilterOp} WhereFilterOp
 */
export const noFirestore = firestore === null;
/**
 * @template {Item} T
 */
export class Model {
  /**
   * @param {string} _collectionID
   * @param {{new(): T}} [ItemClass=Item]
   * @param {Partial<import("./model_type_info").ModelTypeInfo>} meta
   */
  constructor(_collectionID, ItemClass = Item, meta) {
    this._ref = noFirestore
      ? { path: _collectionID }
      : collection(firestore, _collectionID);
    this.Item = ItemClass ?? Item;
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
        const x = new model.Item(snapshot.ref, false, model);
        x.setData(data);
        x._isLoaded = true;

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
   * @param {string} id
   * @param {boolean} isCreate
   * @returns {T}
   */
  item(id, isCreate) {
    return new this.Item(this.ref(id), isCreate, this);
  }
  /**
   * @param {string} id
   * @param {boolean} isCreate
   * @returns {Promise<T>}
   */

  async getOrCreate(
    id,
    init = async (item, txn) => {
      if (item.isLocalOnly()) await item.save(txn);
    }
  ) {
    return await runTransaction(firestore, async (txn) => {
      const m = this.item(id);
      const doc = await txn.get(m._ref);
      if (!doc.exists()) {
        m._isLocalOnly = true;
      } else {
        m.setData(doc.data());
      }
      m._isLoaded = true;
      await init(m, txn);
      return m;
    });
  }
  /**
   * @returns {T}
   */
  create() {
    return new this.Item(this.ref(), true, this);
  }
  ref(...id) {
    return noFirestore
      ? { path: "server-side", id: "server-side" }
      : doc(this._ref, ...id);
  }
}

/**
 * @class
 * @property {import("firebase/firestore").DocumentReference} _ref
 */
export class Item {
  constructor(ref, isNew, model) {
    Object.defineProperty(this, "_ref", { value: ref });
    Object.defineProperty(this, "_model", { value: model });
    Object.defineProperty(this, "_isLocalOnly", {
      writable: true,
      value: !!isNew,
    });
    Object.defineProperty(this, "_isLoaded", {
      writable: true,
      value: !!isNew,
    });
  }
  static empty() {
    return new this();
  }
  /**
   * Related method is Model.getOrCreate which automatically loads and optionally creates the item if it does not exist.
   */
  async load() {
    let data;
    try {
      data = await this.asQuery().get();
    } catch (e) {
      throw new Error(`Client is offline ${e}`);
    }
    if (data === undefined) {
      throw new ItemDoesNotExist(this);
    }
    this.setData(data);
    if (this._isLocalOnly) this._isLocalOnly = false;
    this._isLoaded = true;
    return this;
  }
  /*
    Used for creating and overwriting documents in firestore.
  */
  async save(txn) {
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (this._isLocalOnly) {
      // We add merge:true here to handle Metadata and SchoolData's unique case (non-unique uids).
      // Might refactor out later
      if (txn) {
        await txn.set(this._ref, this.data(), { merge: true });
      } else {
        await setDoc(this._ref, this.data(), { merge: true });
      }
      this._isLocalOnly = false;
    } else await this._update(txn);
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
    if (this._isLocalOnly) {
      await this.save(txn);
    } else await this._update(txn, data);
  }

  async _update(txn, data = this.data()) {
    if (noFirestore) throw InvalidState("No Firestore!!");
    if (txn) txn.update(this._ref, data);
    else await updateDoc(this._ref, data);
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
    if (!this._isLoaded)
      throw new InvalidState("Cannot read document that is not loaded");
    return Object.assign({}, this);
  }
  setData(d) {
    Object.assign(this, pick(d, Object.keys(this)));
  }
  asQuery() {
    return new DocumentQueryCursor(this._ref);
  }
  isLocalOnly() {
    return this._isLocalOnly;
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
}
