import { CountedModel } from "./counted_model";
import { UserModelItem } from "./user";

class Student extends UserModelItem {
  bloodGroup = "";
  genotype = "";
  disability = "";
  registrationId = "";
  parentId1 = "";
  parentId2 = "";
}
const Students = new CountedModel("students", Student);
export default Students;
