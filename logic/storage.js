import { storage } from "./firebase_init";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { daysToMs } from "@/utils/time_utils";
import { FileTracker } from "@/models/file_tracker";
/** @param {File} file*/
export async function uploadFile(file) {
  const filename = file.name;
  const path = "/images/" + uuid() + "-" + filename;
  await markFileForAutoCleanup(path);
  return await getDownloadURL(
    (
      await uploadBytes(ref(storage, path), file, {
        mimeType: file.type,
      })
    ).ref
  );
}

const ONE_WEEK = daysToMs(7);
const _id = (path) => path.replace(/^.*\//, "").replace(/[^A-Za-z0-9]/g, "");

async function markFileForAutoCleanup(path) {
  await FileTracker.getOrCreate(_id(path), async (item, txn) => {
    item.path = path;
    item.time = Date.now() + ONE_WEEK;
    await item.save(txn);
  });
}
export async function deleteInTxn(txn, path) {
  return txn.set(FileTracker.ref(_id(ref(storage, path).fullPath)), {
    path: path,
    time: 0,
  });
}
export async function keepInTxn(txn, path) {
  return txn.delete(FileTracker.ref(_id(ref(storage, path).fullPath)), {
    exists: true,
  });
}

const fileProps = Symbol();
/**
 *
 * @param {Array<String>} props
 * @param {typeof import("../models/lib/counted_model").CountedItem} ItemClass
 */
export const trackFiles = (props, ItemClass) => {
  ItemClass.markTriggersUpdateTxn(props);
  ItemClass.prototype[fileProps] = []
    .concat(ItemClass.prototype[fileProps])
    .concat(props)
    .filter(Boolean);
};
export async function onFilesUpdateItem(item, txn, newState, oldState) {
  item[fileProps].forEach((e) => {
    if (oldState[e] !== newState[e]) {
      console.log(
        "Updating " + e + " from " + oldState[e] + " to " + newState[e]
      );
      if (oldState[e]) deleteInTxn(txn, oldState[e]);
      if (newState[e]) keepInTxn(txn, newState[e]);
    }
  });
}
export async function onFilesAddItem(item, txn, data) {
  item[fileProps].forEach((e) => {
    if (data[e]) keepInTxn(txn, data[e]);
  });
}
export async function onFilesDeleteItem(item, txn, data) {
  item[fileProps].forEach((e) => {
    if (data[e]) deleteInTxn(txn, data[e]);
  });
}
