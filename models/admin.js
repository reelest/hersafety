import { CountedModel } from "./lib/counted_model";
import { UserMeta, UserModelItem } from "./user";

export class Admin extends UserModelItem {
  getRole() {
    return "admin";
  }
}
const Admins = new CountedModel("administrators", Admin, {
  ...UserMeta,
});
export default Admins;
