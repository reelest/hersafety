import { CountedModel } from "./lib/counted_model";
import { UserData, UserMeta } from "./user_data";

class User extends UserData {
  getRole() {
    return "user";
  }
}

const Users = new CountedModel("users", User, {
  ...UserMeta,
});
export default Users;
