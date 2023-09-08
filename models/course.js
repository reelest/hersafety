import { Hidden } from "@mui/material";
import { Model, Item } from "./lib/model";
import ClassRooms from "./classroom";
import { getSessions } from "@/logic/session";

export class Course extends Item {
  descriptionId = "";
  name = "";
  description = "";
  classId = "";
  teacherId = "";
  session = getSessions().data.slice(-1)[0];
}
const Courses = new Model("courses", Course, {
  name: Hidden,
  description: Hidden,
  descriptionId: Hidden,
  classId: {
    type: "ref",
    refSearchQuery: (item) => ClassRooms.withFilter("classId", "==", item.id()),
  },
  teacherId: {
    type: "ref",
    refSearchQuery: "teacher",
  },
});
export default Courses;
