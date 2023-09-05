import { CountedModel } from "./lib/counted_model";
import { UserMeta, UserModelItem } from "./user";

export class Parent extends UserModelItem {
  getRole() {
    return "parent";
  }
}
const Parents = new CountedModel("parents", Parent, {
  ...UserMeta,
});
export default Parents;
