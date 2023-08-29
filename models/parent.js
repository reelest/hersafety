import { CountedModel } from "./counted_model";
import { UserModelItem } from "./user";

export class Parent extends UserModelItem {
  getRole() {
    return "parent";
  }
}
const Parents = new CountedModel("parents", Parent);
export default Parents;
