import { increment } from "firebase/firestore";
import { CountedItem } from "./counted_model";
import { Item, Model } from "./model";
import pick from "@/utils/pick";
//A clone of the firebase authentication model is stored in firestore
//in order to manage users with the uid as the key
//Deleting users makes use of the firebase admin sdk

class UserRole extends Item {
  role = "guest";
}
export const UserRoles = new Model("roles", UserRole);

export class UserModelItem extends CountedItem {
  firstName = "";
  lastName = "";
  otherNames = "";
  email = "";
  emailVerified = false;
  phoneNumber = -1;
  dateCreated = Date.now();
  lastUpdated = -1;
  lastLogin = -1;
  profileCompleted = false;

  getName() {
    return `${this.firstName} ${this.lastName}`;
  }
  getRole() {
    return "guest";
  }
  /**
   *
   * @param {import("firebase/auth").User} user
   */
  static of(user) {
    const m = new UserModelItem();
    return Object.assign(m, pick(user, Object.keys(m)));
  }
  async markCompleted(completed) {
    if (this.profileCompleted === completed) return;
    await this.atomicUpdate(async (txn, lastState) => {
      const prevCompleted = lastState.profileCompleted;
      if ((prevCompleted && !completed) || (completed && !prevCompleted)) {
        this.getCounter().update(txn, {
          completedProfiles: increment(completed ? 1 : -1),
        });
        this.update(txn, { profileCompleted: completed });
      }
    });
    this.profileCompleted = completed;
  }
  async onDeleteItem(txn, lastState) {
    if (lastState.profileCompleted)
      this.getCounter().update(txn, {
        completedProfiles: increment(-1),
      });
    await UserRoles.item(this.id()).delete(txn);
  }
  async onAddItem(txn, lastState) {
    if (lastState.profileCompleted)
      this.getCounter().update(txn, {
        completedProfiles: increment(1),
      });
  }
}
