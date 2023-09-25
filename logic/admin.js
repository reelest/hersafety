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

export const activateUser = async (item) => {
  await UserRoles.getOrCreate(item.uid, async (userRole, txn) => {
    userRole.role = item.role;
    await userRole.save(txn);
  });
  const userModel = mapRoleToUserModel(item.role);
  await userModel.getOrCreate(item.uid, async (user, txn) => {
    user.setData({ email: item.email, ...parseName(item.name) });
    await user.save(txn);
    await item.delete(txn);
  });
};
