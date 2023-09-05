import { Model, Item } from "./lib/model";

export class Grade extends Item {
  test1 = 0;
  test2 = 0;
  exam = 0;
  classId = "";
  studentId = "";
  session = "";
}
const Grades = new Model("grades", Grade);
export default Grades;
