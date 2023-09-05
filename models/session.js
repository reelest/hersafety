import { arrayRemove, arrayUnion, increment } from "firebase/firestore";
import { CountedItem, CountedModel } from "./lib/counted_model";
//A clone of the firebase authentication model is stored in firestore
//in order to manage users with the uid as the key
//Deleting users makes use of the firebase admin sdk

export class Session extends CountedItem {
  name = "";

  async onDeleteItem(txn) {
    return this.getCounter().set(
      {
        sessions: arrayRemove(this.name),
      },
      txn
    );
  }
  async onAddItem(txn) {
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
export const Sessions = new SessionModel("sessions", Session);
