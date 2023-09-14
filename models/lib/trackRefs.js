import { UnimplementedError } from "@/models/lib/errors";
import { None } from "@/utils/none";
import notIn from "@/utils/notIn";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import { getItemFromStore } from "./item_store";

const refProps = Symbol("refProps");

function toArray(e) {
  return Array.isArray(e) ? e : e ? [e] : [];
}
/**
 *
 * @param {import("@/models/lib/model").Item} item
 * @param {import("firebase/firestore").Transaction} txn
 * @param {*} newState
 */
export async function onRefsUpdateItem(item, txn, newState, isUpdate = true) {
  if (!item[refProps]) return;
  const { props, AddActions, RemoveActions } = item[refProps];
  await Promise.all(
    props.map(async (e) => {
      if (isUpdate && !item.didUpdate(e)) return;
      const newValue = toArray(newState[e]);
      const oldValue = toArray((await item.read(txn))[e]);
      const added = newValue.filter(notIn(oldValue));
      const removed = oldValue.filter(notIn(newValue));
      await Promise.all(
        removed.map(async (id) => {
          const meta = item.model().Meta[e];
          const refModel =
            meta.type === "array" ? meta.arrayType.refModel : meta.refModel;
          const refItem = refModel.item(id);
          await Promise.all(
            RemoveActions[e]?.map?.(async (action) => {
              await action.run(txn, item, refItem);
            })
          );
        })
      );
      await Promise.all(
        added.map(async (id) => {
          const meta = item.model().Meta[e];
          const refModel =
            meta.type === "array" ? meta.arrayType.refModel : meta.refModel;
          const created = getItemFromStore(refModel.ref(id));
          if (created !== null && created.isLocalOnly()) {
            await created.save(txn);
          }
          const refItem = created ?? refModel.item(id);
          await Promise.all(
            AddActions[e]?.map?.(async (action) => {
              await action.run(txn, item, refItem);
            })
          );
        })
      );
    })
  );
}
export async function onRefsAddItem(item, txn, newState) {
  return onRefsUpdateItem(item, txn, newState, false);
}

export async function onRefsDeleteItem(item, txn) {
  return onRefsUpdateItem(item, txn, None, false);
}
class Action {
  constructor(prop) {
    this.prop = prop;
  }
  // eslint-disable-next-line no-unused-vars
  async run(txn, item, refItem) {
    throw UnimplementedError("Action.run is not implemented");
  }
}

export class AppendIDAction extends Action {
  /**
   *
   * @param {import("firebase/firestore").Transaction} txn
   * @param {Item} item
   * @param {Item} refItem
   */
  async run(txn, item, refItem) {
    await refItem.set({ [this.prop]: arrayUnion(item.id()) }, txn);
  }
}

export class SetIDAction extends Action {
  /**
   *
   * @param {import("firebase/firestore").Transaction} txn
   * @param {Item} item
   * @param {Item} refItem
   */
  async run(txn, item, refItem) {
    await refItem.set({ [this.prop]: item.id() }, txn);
  }
}

export class RemoveIDAction extends Action {
  /**
   *
   * @param {import("firebase/firestore").Transaction} txn
   * @param {Item} item
   * @param {Item} refItem
   */
  async run(txn, item, refItem) {
    await refItem.set({ [this.prop]: arrayRemove(item.id()) }, txn);
  }
}

export class UnsetIDAction extends Action {
  /**
   *
   * @param {import("firebase/firestore").Transaction} txn
   * @param {Item} item
   * @param {Item} refItem
   */
  async run(txn, item, refItem) {
    await refItem.set({ [this.prop]: null }, txn);
  }
}

export class DeleteItemAction extends Action {
  /**
   *
   * @param {import("firebase/firestore").Transaction} txn
   * @param {Item} item
   * @param {Item} refItem
   */
  async run(txn, item, refItem) {
    await refItem.delete(txn);
  }
}
/**
 *
 * @param {typeof import("./counted_item").CountedItem} ItemClass
 * @param {Array<String>} props
 * @param {Array<Action>} addActions
 * @param {Array<Action>} removeActions
 */
export function trackRefs(ItemClass, props, addActions, removeActions) {
  const prev = ItemClass.prototype[refProps];
  const newRefProps = {
    props: prev ? prev.props.concat(props) : props,
    AddActions: Object.assign(
      {},
      prev ? prev.AddActions : null,
      ...props.map((e) => ({
        [e]: prev ? prev.AddActions[e].concat(addActions) : addActions,
      }))
    ),
    RemoveActions: Object.assign(
      {},
      prev ? prev.RemoveActions : null,
      ...props.map((e) => ({
        [e]: prev ? prev.RemoveActions[e].concat(removeActions) : addActions,
      }))
    ),
  };
  ItemClass.markTriggersUpdateTxn(props, true);
  ItemClass.prototype[refProps] = newRefProps;
}
