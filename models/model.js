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
import { MultiQuery, DocumentQuery } from "./query";
/**
 * @typedef {[string, import("firebase/firestore").WhereFilterOp, any]} FilterParam
 */
export const noFirestore = firestore === null;
export class Model {
  constructor(_collectionID, ItemClass = Item, Empty, meta) {
    this._ref = noFirestore
      ? { path: _collectionID }
      : collection(firestore, _collectionID);
    this.Item = ItemClass ?? Item;
    this.Empty = Empty ?? {};
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
        Object.assign(x, data);
        return x;
      },
    };
  }
  request() {
    return new MultiQuery(this);
  }
  all() {
    return this.request();
  }
  /**
   * @param {...FilterParam} params
   */
  filter(key, op, val) {
    return this.all().filter(key, op, val);
  }
  item(id, isCreate) {
    return new this.Item(this.ref(id), isCreate, this);
  }
  async getOrCreate(id) {
    const m = new this.Item(this.ref(id), true, this);
    try {
      await m.load();
    } catch (e) {
      checkError(e, ItemDoesNotExist);
    }
    return m;
  }
  create() {
    return new this.Item(this.ref(), true, this);
  }
  ref(...id) {
    return noFirestore ? { path: "server-side" } : doc(this._ref, ...id);
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
    Object.defineProperty(this, "_isValid", {
      writable: true,
      value: !!isNew,
    });
    Object.assign(this, model.Empty);
  }
  async save() {
    if (noFirestore) throw InvalidState("No Firestore!!");

    if (this._isLocalOnly) {
      // We add merge:true here to handle Metadata and SchoolData's unique case (non-unique uids).
      // Might refactor out later
      await setDoc(this._ref, this.data(), { merge: true });
      this._isLocalOnly = false;
    } else await updateDoc(this._ref, this.data());
  }
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
    Object.assign(this, data);
    if (this._isLocalOnly) this._isLocalOnly = false;
    this._isValid = true;
    return this;
  }
  async set(data) {
    if (noFirestore) throw InvalidState("No Firestore!!");

    Object.assign(this, pick(data, Object.keys(this)));
    if (this._isLocalOnly) {
      await this.save();
    } else await updateDoc(this._ref, data);
    return this;
  }
  // Deleting a document does not make it local only. Other clients might have copies of it.
  // While they would typically not be able to update it,
  // if restoration was made possible by marking it as local only,
  // each client would be able to restore potentially conflicting versions of the same document.
  async delete() {
    if (noFirestore) throw InvalidState("No Firestore!!");
    await deleteDoc(this._ref);
  }
  /**
   * @param {(txn: import("firebase/firestore").Transaction, doc: ThisType)=>Promise} cb
   * @returns
   */
  async atomicUpdate(cb) {
    return runTransaction(firestore, async (txn) => {
      const doc = await txn.get(this._ref);
      if (doc.exists()) {
        return await cb(txn, doc.data());
      }
      return false;
    });
  }
  data() {
    if (!this._isValid)
      throw new InvalidState("Cannot read document that is not loaded");
    return Object.assign({}, this);
  }
  asQuery() {
    return new DocumentQuery(this._ref);
  }
  isLocalOnly() {
    return this._isLocalOnly;
  }
  id() {
    return this._ref.id;
  }
  fullName() {
    return this._ref.path;
  }
  getString(name) {
    return this._model.Meta[name].options.find((e) => e.value === this[name])
      .label;
  }
}
