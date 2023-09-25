import { CountedModel } from "./lib/counted_model";
import Prescriptions from "./prescription";
import { UserData } from "./user_data";

class Client extends UserData {
  getRole() {
    return "client";
  }
  prescriptions = [];
}

const Clients = new CountedModel("clients", Client, {
  prescriptions: {
    type: "array",
    arrayType: {
      type: "ref",
      refModel: Prescriptions,
    },
  },
});
export default Clients;
