import { increment } from "firebase/firestore";
import { CountedItem } from "./counted_model";
import { Model } from "./model";
//A clone of the firebase authentication model is stored in firestore
//in order to manage users with the uid as the key
//Deleting users makes use of the firebase admin sdk

export const UserRoles = new Model("roles", null, { role: "guest" });

export class UserModelItem extends CountedItem {
  firstName = "";
  lastName = "";
  email = "";
  emailVerified = false;
  phoneNumber = -1;
  dateCreated = Date.now();
  lastLogin = -1;
  lastUpdated = -1;
  profileCompleted = false;

  async markCompleted(completed) {
    if (this.profileCompleted === completed) return;
    await this.atomicUpdate(async (txn, lastState) => {
      const prevCompleted = lastState.profileCompleted;
      if ((prevCompleted && !completed) || (completed && !prevCompleted)) {
        txn.update(this._counterRef, {
          completedProfiles: increment(completed ? 1 : -1),
        });
        txn.update(this._ref, { profileCompleted: completed });
      }
    });
    this.profileCompleted = completed;
  }
  async onDeleteItem(txn, lastState) {
    if (lastState.profileCompleted)
      txn.update(this._counterRef, {
        completedProfiles: increment(-1),
      });
  }
  async onAddItem(txn, lastState) {
    if (lastState.profileCompleted)
      txn.update(this._counterRef, {
        completedProfiles: increment(1),
      });
  }
}
