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
import {
  indexForSearch,
  onSearchAddItem,
  onSearchDeleteItem,
  onSearchUpdateItem,
} from "@/logic/search";
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
    const m = UserModelItem.empty();
    return m.setData(user);
  }

  async onUpdateItem(txn, newState, lastState) {
    await super.onUpdateItem(txn, newState, lastState); //TODO remove this
    await onSearchUpdateItem(this, txn, newState);
    await onFilesUpdateItem(this, txn, newState, lastState);
  }

  async onDeleteItem(txn, lastState) {
    await super.onDeleteItem(txn, lastState); //TODO remove this
    await onSearchDeleteItem(this, txn);
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
  async onAddItem(txn, newState) {
    await super.onAddItem(txn, newState); //TODO remove this
    await onSearchAddItem(this, txn, newState);
    await onFilesAddItem(this, txn, newState);
    if (newState.profileCompleted)
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
indexForSearch(UserModelItem, [
  "firstName",
  "lastName",
  "otherNames",
  "email",
  "phoneNumber",
]);
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
