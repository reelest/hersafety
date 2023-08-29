import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase_init";
import createSubscription from "@/utils/createSubscription";
export const [useUser, , , getUser] = createSubscription(
  /** @type {import("@/utils/createSubscription").SubscribeInit<import("firebase/auth").User>} */ (
    (setUser) => onAuthStateChanged(auth, setUser)
  )
);
export const signIn = async ({ email, password }) => {
  await signInWithEmailAndPassword(auth, email, password);
};
export const doLogOut = async () => {
  await signOut(auth);
};

export const signUp = async ({ email, password }) => {
  await createUserWithEmailAndPassword(auth, email, password);
};

export const resetPassword = async ({ email }) => {
  sendPasswordResetEmail(auth, email);
};
