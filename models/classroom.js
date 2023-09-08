import Courses from "./course";
import { Model, Item } from "./lib/model";
import Students from "./student";
import Teachers from "./teacher";

export class ClassRoom extends Item {
  name = "";
  branch = "";
  session = "";
  formTeacher = "";
  teachers() {
    return Teachers.withFilter("classId", "array-contains", this.id());
  }
  subjects() {
    return Courses.withFilter("classId", "==", this.id());
  }
  students() {
    return Students.withFilter("classId", "array-contains", this.id());
  }
}
const ClassRooms = new Model("classes", Event);
export default ClassRooms;
