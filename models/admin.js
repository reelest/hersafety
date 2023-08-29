import { CountedModel } from "./counted_model";
import { UserModelItem } from "./user";

export class Admin extends UserModelItem {
  getRole() {
    return "admin";
  }
}
const Admins = new CountedModel("administrators", Admin);
export default Admins;
