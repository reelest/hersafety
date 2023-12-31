import { CountedModel } from "./lib/counted_model";
import { UserData, UserMeta } from "./user_data";

class Police extends UserData {
  getRole() {
    return "police";
  }
}

const Polices = new CountedModel("police", Police, {
  ...UserMeta,
});
export default Polices;
