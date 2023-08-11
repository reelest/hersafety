import { CountedModel } from "./counted_model";
import { UserModel } from "./user";

class Student extends UserModel {}
const Students = new CountedModel("students", Student);
export default Students;
