import { increment } from "firebase/firestore";
import { CountedItem } from "./lib/counted_item";
import { Item, Model, USES_EXACT_IDS } from "./lib/model";
import { HiddenField, HiddenTime } from "./lib/model_types";
import { trackFiles } from "./lib/trackFiles";
import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";
import { indexForSearch } from "./lib/indexForSearch";
//A clone of the firebase authentication model is stored in firestore
//in order to manage users with the uid as the key
//Deleting users makes use of the firebase admin sdk

class UserRole extends Item {
  role = "guest";
}
export const UserRoles = new Model("roles", UserRole, {
  [USES_EXACT_IDS]: true,
});

export class UserData extends CountedItem {
  firstName = "";
  lastName = "";
  otherNames = "";
  email = "";
  emailVerified = false;
  phoneNumber = "";
  dateCreated = new Date();
  lastUpdated = new Date();
  photoURL = "";
  lastLogin = new Date(0);
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
    const m = UserData.empty();
    m.setData(user);
    return m;
  }

  async onDeleteItem(txn, prevState) {
    await super.onDeleteItem(txn, prevState);
    if (prevState.profileCompleted)
      this.getCounter().set(
        {
          completedProfiles: increment(-1),
        },
        txn
      );
    await UserRoles.item(this.id()).delete(txn);
  }
  async onAddItem(txn, newState) {
    await super.onAddItem(txn, newState);
    if (newState.profileCompleted)
      this.getCounter().set(
        {
          completedProfiles: increment(1),
        },
        txn
      );
  }
  static {
    trackFiles(this, ["photoURL"]);
    this.markTriggersUpdateTxn(["profileCompleted"]);
    indexForSearch(this, [
      "firstName",
      "lastName",
      "otherNames",
      "email",
      "phoneNumber",
    ]);
  }
}
/**
 * @type {import("./lib/model_type_info").ModelTypeInfo}
 */
export const UserMeta = {
  [USES_EXACT_IDS]: true,
  dateCreated: HiddenField,
  phoneNumber: {
    stringType: "tel",
  },
  email: {
    stringType: "email",
  },
  lastUpdated: HiddenField,
  lastLogin: HiddenField,
  profileCompleted: HiddenField,
  emailVerified: HiddenField,
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
