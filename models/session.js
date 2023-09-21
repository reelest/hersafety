import { arrayRemove, arrayUnion } from "firebase/firestore";
import { CountedModel } from "./lib/counted_model";
import { CountedItem } from "./lib/counted_item";
import { USES_EXACT_IDS } from "./lib/model";
//A clone of the firebase authentication model is stored in firestore
//in order to manage users with the uid as the key
//Deleting users makes use of the firebase admin sdk

export class Session extends CountedItem {
  name = "";
  dateCreated = new Date();
  async onDeleteItem(txn, prevState) {
    await super.onDeleteItem(txn, prevState);
    return this.getCounter().set(
      {
        sessions: arrayRemove(this.name),
      },
      txn
    );
  }
  async onAddItem(txn, newState) {
    await super.onAddItem(txn, newState);
    this.getCounter().set(
      {
        sessions: arrayUnion(this.name),
      },
      txn
    );
  }
}

class SessionModel extends CountedModel {
  async initCounter(item) {
    item.sessions = arrayUnion();
  }
}
export const Sessions = new SessionModel("sessions", Session, {
  [USES_EXACT_IDS]: true,
});
