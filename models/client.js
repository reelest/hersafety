import { CountedModel } from "./lib/counted_model";
import { UserData, UserMeta } from "./user_data";

class Client extends UserData {
  getRole() {
    return "client";
  }
}

const Clients = new CountedModel("clients", Client, {
  ...UserMeta,
});
export default Clients;
