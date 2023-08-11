import { CountedItem } from "./counted_model";

//A clone of the firebase authentication model is stored in firestore
//in order to manage users with the uid as the key
//Deleting users makes use of the firebase admin sdk
export class UserModel extends CountedItem {
  firstName = "";
  lastName = "";
  email = "";
  emailVerified = false;
  phoneNumber = -1;
  dateCreated = Date.now();
  lastLogin = -1;
  lastUpdated = -1;
}
