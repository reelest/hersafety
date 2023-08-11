import { CountedModel } from "./counted_model";
import { UserModel } from "./user";

class Teacher extends UserModel {}
const Teachers = new CountedModel("teachers", Teacher);
export default Teachers;
