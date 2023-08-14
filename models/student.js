import { CountedTable } from "./counted_table";
import { UserModel } from "./user";

class Student extends UserModel {
  bloodGroup = "";
  genotype = "";
  disability = "";
  registrationId = "";
  parentId1 = "";
  parentId2 = "";
}
const Students = new CountedTable("students", Student);
export default Students;
