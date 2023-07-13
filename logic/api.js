import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase_init";
import createSubscription from "@/utils/createSubscription";
export const [useUser] = createSubscription((setUser) =>
  onAuthStateChanged(auth, setUser)
);
