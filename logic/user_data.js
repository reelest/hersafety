import Students from "@/models/student";
import Teachers from "@/models/teacher";
import Parents from "@/models/parent";
import Admins from "@/models/admin";
import { useUser } from "./auth";
import usePromise from "@/utils/usePromise";
import { useRef } from "react";
import { useUpdate } from "react-use";
import { UserModelItem, UserRoles } from "@/models/user";
import useListener from "@/utils/useListener";
import useWindowRef from "@/utils/useWindowRef";

const lookupRole = async (uid) => (await UserRoles.getOrCreate(uid)).role;

export const updateUserRole = async (uid, role) => {
  await UserRoles.item(uid).set({ role });
};
/**
 *
 * @param {string} role
 * @returns {Model} model
 */
export const mapRoleToModel = (role) => {
  switch (role) {
    case "student":
      return Students;
    case "teacher":
      return Teachers;
    case "parent":
      return Parents;
    case "admin":
      return Admins;
  }
};
/**
 *
 * @param {import("firebase/auth").User} user
 * @returns {import("../models/user").UserModelItem}
 */
const loadUserData = async (user) => {
  const role = await lookupRole(user.uid);
  if (role !== "guest") {
    const data = await mapRoleToModel(role).getOrCreate(user.uid);
    if (data.isLocalOnly()) {
      data.email = user.email;
      data.emailVerified = user.emailVerified;
      data.phoneNumber = user.phoneNumber;
      data.lastLogin = Date.now();
    }
    data.lastLogin = Date.now();
    await data.set({ lastLogin: true });
    return data;
  }
  return UserModelItem.of(user);
};
/**
 *
 * @returns {import("../models/user").UserModelItem}
 */
export default function useUserData() {
  const user = useUser();
  const retryDelay = useRef(1000);
  const retry = useUpdate();
  useListener(useWindowRef(), "online", retry);
  return usePromise(async () => {
    try {
      if (user) {
        const data = await loadUserData(user);
        retryDelay.current = 1000;
        return data;
      } else return user;
    } catch (e) {
      retryDelay.current = Math.min(retryDelay.current * 2, 60000);
      console.error(e, `Retrying in ${retryDelay.current / 1000} seconds`);
      setTimeout(retry, retryDelay.current);
    }
  }, [user, retryDelay.current]);
}
