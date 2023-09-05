import { CountedModel } from "./lib/counted_model";
import { UserMeta, UserModelItem } from "./user";

export class Teacher extends UserModelItem {
  getRole() {
    return "teacher";
  }
}
const Teachers = new CountedModel("teachers", Teacher, {
  ...UserMeta,
});
export default Teachers;
