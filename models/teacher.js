import { CountedModel } from "./lib/counted_model";
import { UserMeta, UserData } from "./user_data";

export class Teacher extends UserData {
  getRole() {
    return "teacher";
  }
}
const Teachers = new CountedModel("teachers", Teacher, {
  ...UserMeta,
});
export default Teachers;
