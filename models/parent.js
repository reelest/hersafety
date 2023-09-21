import { CountedModel } from "./lib/counted_model";
import { UserMeta, UserData } from "./user_data";

export class Parent extends UserData {
  getRole() {
    return "parent";
  }
}
const Parents = new CountedModel("parents", Parent, {
  ...UserMeta,
});
export default Parents;
