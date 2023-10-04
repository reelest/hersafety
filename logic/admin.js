// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import isServerSide from "@/utils/is_server_side";
import { UserRoles } from "@/models/user_data";
import { mapRoleToUserModel } from "./user_data";
import { firebaseConfig } from "./firebase_init";

// Initialize Firebase but only on client
const app = isServerSide ? null : initializeApp(firebaseConfig, "admin");
const auth = isServerSide ? null : getAuth(app);
export async function createUser(email, password) {
  try {
    return (await createUserWithEmailAndPassword(auth, email, password)).user
      .uid;
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      try {
        return (await signInWithEmailAndPassword(auth, email, password)).user
          .uid;
      } catch (e) {
        //DO NOTHING
      }
    }
    throw e;
  }
}
const parseName = (name) => {
  const a = name.split(" ");
  return {
    firstName: a[0],
    lastName: a.length > 1 ? a[1] : "",
  };
};
/**
 * Turn a guest user into a real user
 * @param {({role: string, uid: string, name: string} & import("@/models/lib/model_type_info").Item?)} activationRequest
 */
export const activateUser = async (activationRequest) => {
  await mapRoleToUserModel(activationRequest.role).getOrCreate(
    activationRequest.uid,
    async (user, txn) => {
      user.setData({
        email: activationRequest.email,
        ...parseName(activationRequest.name),
      });
      await user.save(txn);
      await activationRequest?.delete?.(txn);
    }
  );
};
