import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase_init";
import { markFileForAutoCleanup } from "@/models/lib/trackFiles";
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
