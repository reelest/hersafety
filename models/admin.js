import { CountedModel } from "./lib/counted_model";
import { UserData, UserMeta } from "./user_data";

class Admin extends UserData {
  getRole() {
    return "admin";
  }
}

const Admins = new CountedModel("admins", Admin, {
  ...UserMeta,
});
export default Admins;
