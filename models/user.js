import { increment } from "firebase/firestore";
import { CountedItem } from "./lib/counted_model";
import { Item, Model } from "./lib/model";
import pick from "@/utils/pick";
import { Hidden } from "./lib/model_types";
import {
  onFilesAddItem,
  onFilesDeleteItem,
  onFilesUpdateItem,
  trackFiles,
} from "@/logic/storage";
import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";
import { indexForSearch } from "@/logic/search";
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
  phoneNumber = "";
  dateCreated = Date.now();
  lastUpdated = Date.now();
  photoURL = "";
  lastLogin = -1;
  profileCompleted = false;

  getName() {
    return `${this.firstName} ${this.otherNames} ${this.lastName}`;
  }
  getRole() {
    return "guest";
  }
  /**
   *
   * @param {import("firebase/auth").User} user
   */
  static of(user) {
    const m = new UserModelItem(null, null, null);
    return Object.assign(m, pick(user, Object.keys(m)));
  }

  async onUpdateItem(txn, currentState, lastState) {
    await super.onUpdateItem(txn, currentState, lastState);
    await onFilesUpdateItem(this, txn, currentState, lastState);
  }

  async onDeleteItem(txn, lastState) {
    await super.onDeleteItem(txn, lastState);
    await onFilesDeleteItem(this, txn, lastState);
    if (lastState.profileCompleted)
      this.getCounter().set(
        {
          completedProfiles: increment(-1),
        },
        txn
      );
    await UserRoles.item(this.id()).delete(txn);
  }
  async onAddItem(txn, currentState) {
    await super.onAddItem(txn, currentState);
    await onFilesAddItem(this, txn, currentState);
    if (currentState.profileCompleted)
      this.getCounter().set(
        {
          completedProfiles: increment(1),
        },
        txn
      );
  }
}
trackFiles(UserModelItem, ["photoURL"]);
UserModelItem.markTriggersUpdateTxn(["profileCompleted"]);
indexForSearch(UserModelItem, ["profileCompleted"]);
export const UserMeta = {
  dateCreated: Hidden,
  lastUpdated: Hidden,
  lastLogin: Hidden,
  profileCompleted: Hidden,
  emailVerified: Hidden,
  otherNames: {
    required: false,
  },
  photoURL: {
    required: false,
    type: "image",
  },
  [MODEL_ITEM_PREVIEW](item) {
    return {
      title: item.getName(),
      description: item.email,
      avatar: item.photoURL,
    };
  },
};
