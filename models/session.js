import { arrayRemove, arrayUnion, increment } from "firebase/firestore";
import { CountedItem, CountedTable } from "./counted_table";
import { Table } from "./table";
//A clone of the firebase authentication model is stored in firestore
//in order to manage users with the uid as the key
//Deleting users makes use of the firebase admin sdk

export const UserRoles = new Table("roles", null, { role: "guest" });

class Session extends CountedItem {
  name = "";

  async onDeleteItem(txn) {
    txn.update(this._counterRef, {
      sessions: arrayRemove(this.name),
    });
  }
  async onAddItem(txn) {
    txn.update(this._counterRef, {
      sessions: arrayUnion(this.name),
    });
  }
}

class SessionTable extends CountedTable {
  async initCounter(doc) {
    doc.sessions = arrayUnion();
  }
}
export const Sessions = new SessionTable("sessions", Session);
