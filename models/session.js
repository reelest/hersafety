import { arrayRemove, arrayUnion, increment } from "firebase/firestore";
import { CountedItem, CountedModel } from "./counted_model";
//A clone of the firebase authentication model is stored in firestore
//in order to manage users with the uid as the key
//Deleting users makes use of the firebase admin sdk

export class Session extends CountedItem {
  name = "";

  async onDeleteItem(txn) {
    return this.getCounter().update(txn, {
      sessions: arrayRemove(this.name),
    });
  }
  async onAddItem(txn) {
    this.getCounter().update(txn, {
      sessions: arrayUnion(this.name),
    });
  }
}

class SessionModel extends CountedModel {
  async initCounter(doc) {
    doc.sessions = arrayUnion();
  }
}
export const Sessions = new SessionModel("sessions", Session);
