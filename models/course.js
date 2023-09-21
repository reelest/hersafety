import { Model, Item } from "./lib/model";
import ClassRooms from "./classroom";
import { getSessions } from "@/logic/session";
import { HiddenField } from "./lib/model_types";
import { CountedItem } from "./lib/counted_item";
import Teachers from "./teacher";
import { Sessions } from "./session";
import CourseDescriptions from "./course_description";
import { connect } from "./lib/trackRefs";

export class Course extends CountedItem {
  descriptionId = "";
  name = "";
  classId = "";
  teacherId = "";
  session = getSessions()?.data?.slice?.(-1)?.[0] ?? "";
}
const Courses = new Model("courses", Course, {
  name: HiddenField,
  descriptionId: {
    type: "ref",
    refModel: CourseDescriptions,
    pickRefQuery: CourseDescriptions.all(),
  },
  classId: {
    type: "ref",
    refModel: ClassRooms,
    pickRefQuery: (item) => ClassRooms.withFilter("classId", "==", item.id()),
  },
  teacherId: {
    type: "ref",
    refModel: Teachers,
    pickRefQuery: "teacher",
  },
  session: {
    type: "ref",
    refModel: Sessions,
    pickRefQuery: async function* () {
      yield* getSessions().data;
    },
  },
});
connect(CourseDescriptions, "assignments", Courses, "descriptionId", true);
export default Courses;
