import { InvalidParameters, UnimplementedError } from "@/models/lib/errors";
import { None } from "@/utils/none";
import notIn from "@/utils/notIn";
import UpdateValue, { isUpdateValue } from "./update_value";
import { getItemFromStore } from "./item_store";
import { getDefaultValue } from "./model_type_info";

const refProps = Symbol("refProps");

function toArray(e) {
  return Array.isArray(e) ? e : e ? [e] : [];
}

//Tracks updates to prevent nested updates
const updateSink = [];
const withUpdate = async (item, prop, cb) => {
  const x = { m: item.model(), id: item.id(), prop };
  if (updateSink.some((e) => e.m === x.m && e.id === x.id && e.prop === x.prop))
    return;
  try {
    console.log("Updating ", x);
    updateSink.push(x);
    return await cb();
  } finally {
    console.log("Updated", x);
    updateSink.splice(updateSink.indexOf(x), 1);
  }
};
/**
 *
 * @typedef {import("@/models/lib/model").Item} Item
 * @param {Item} item
 * @param {import("./lib/transaction").default} txn
 * @param {*} newState
 */
export async function onRefsUpdateItem(item, txn, newState, isUpdate = true) {
  if (!item[refProps]) return;
  const { props, AddActions, RemoveActions } = item[refProps];
  await Promise.all(
    props.map((e) => {
      if (isUpdate && !item.didUpdate(e)) return;
      return withUpdate(item, e, async () => {
        // Currently, UpdateValues are only used when there are no side effects
        if (isUpdateValue(newState[e])) return;
        const newValue = toArray(newState[e]);
        const oldValue = item.isLocalOnly()
          ? []
          : toArray((await item.read(txn))?.[e]);
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
      });
    })
  );
}
export async function onRefsAddItem(item, txn, newState) {
  return onRefsUpdateItem(item, txn, newState, false);
}

export async function onRefsDeleteItem(item, txn) {
  return onRefsUpdateItem(item, txn, None, false);
}

/**
 * One requirement of actions is that they must be idempotent.
 * Otherwise, using them with UpdateValues would fail
 */
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
   * @param {import("./lib/transaction").default} txn
   * @param {Item} item
   * @param {Item} refItem
   */
  async run(txn, item, refItem) {
    console.log(
      "appending " + item.id() + " to " + refItem.uniqueName() + "." + this.prop
    );
    await refItem.set({ [this.prop]: UpdateValue.arrayUnion(item.id()) }, txn);
  }
}

export class SetIDAction extends Action {
  /**
   *
   * @param {import("./lib/transaction").default} txn
   * @param {Item} item
   * @param {Item} refItem
   */
  async run(txn, item, refItem) {
    console.log(
      "setting value " +
        item.id() +
        " for " +
        refItem.uniqueName() +
        "." +
        this.prop
    );
    await refItem.set({ [this.prop]: item.id() }, txn);
  }
}

export class RemoveIDAction extends Action {
  /**
   *
   * @param {import("./lib/transaction").default} txn
   * @param {Item} item
   * @param {Item} refItem
   */
  async run(txn, item, refItem) {
    console.log(
      "removing value " +
        item.id() +
        " from items in " +
        refItem.uniqueName() +
        "." +
        this.prop
    );
    await refItem.set({ [this.prop]: UpdateValue.arrayRemove(item.id()) }, txn);
  }
}

export class UnsetIDAction extends Action {
  /**
   *
   * @param {import("./lib/transaction").default} txn
   * @param {Item} item
   * @param {Item} refItem
   */
  async run(txn, item, refItem) {
    console.log(
      "clearing value " +
        item.id() +
        " for " +
        refItem.uniqueName() +
        "." +
        this.prop
    );
    await refItem.set(
      { [this.prop]: getDefaultValue(refItem.model().Meta[this.prop]) },
      txn
    );
  }
}

export class DeleteItemAction extends Action {
  /**
   *
   * @param {import("./lib/transaction").default} txn
   * @param {Item} item
   * @param {Item} refItem
   */
  async run(txn, item, refItem) {
    console.log("deleting " + refItem.id());
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

/**
 * Actions are used to implement associations
 * Following the method used by sequelize, associations are of four types
 * i. A HasOne B - 1-to-1 with foreign key defined in B
 * ii. A BelongsTo B - 1-to-1 with foreign key defined in A
 * iii. A hasMany B - 1-to-many with foreign key defined in B
 * iv. A belongsToMany B - there is a mapping table between A and B
 */

/**
 * @template {import("./model").Item} K
 * @template {import("./model").Item} L
 * @param {import("./model").Model<K>} model1
 * @param {keyof K} prop1
 * @param {import("./model").Model<L>} model2
 * @param {keyof L} prop2
 * @param {boolean} deleteOnRemove
 */
export function associateModels(
  model1,
  prop1,
  model2,
  prop2,
  deleteOnRemove,
  noRecurse
) {
  const isTwoWay = !!prop2;
  const isArray1 = model1.Meta[prop1].type === "array";
  const isArray2 = isTwoWay && model2.Meta[prop2].type === "array";
  if (isArray2 && deleteOnRemove)
    throw new InvalidParameters("Cannot use deleteOnRemove with array target");
  trackRefs(
    model1._Item,
    [prop1],
    [
      isArray2
        ? new AppendIDAction(prop2)
        : isTwoWay
        ? new SetIDAction(prop2)
        : null,
    ].filter(Boolean),
    [
      deleteOnRemove
        ? new DeleteItemAction()
        : isTwoWay
        ? new UnsetIDAction(prop2)
        : null,
    ].filter(Boolean)
  );

  if (isArray1) model1.Meta[prop1].arrayType.refModel = model2;
  else model1.Meta[prop1].refModel = model2;
  if (!noRecurse && isTwoWay) {
    associateModels(model2, prop2, model1, prop1, false, true);
  }
}
/**
 * @template {Item} K
 * @template {Item} L
 * @param {import("./model").Model<K>} model1
 * @param {keyof K} prop1
 * @param {import("./model").Model<L>} model2
 * @param {keyof L} prop2
 * @param {boolean} deleteOnRemove
 */
export function belongsTo(model1, prop1, model2, prop2, deleteOnRemove) {}

/**
 * @template {Item} K
 * @template {Item} L
 * @param {import("./model").Model<K>} model1
 * @param {keyof K} prop1
 * @param {import("./model").Model<L>} model2
 * @param {keyof L} prop2
 * @param {boolean} deleteOnRemove
 */
export function belongsToMany(model1, prop1, model2, prop2, deleteOnRemove) {
  trackRefs(
    model1,
    [prop1],
    [new SetIDAction(prop2)],
    [deleteOnRemove ? new DeleteItemAction() : new RemoveIDAction(prop2)]
  );
  model2.Meta[prop2].refModel = model1;
}
