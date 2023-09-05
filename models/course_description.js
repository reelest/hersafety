import { Model, Item } from "./lib/model";

export class CourseDescription extends Item {
  name = "";
  description = "";
}
const CourseDescriptions = new Model("course_descriptions", CourseDescription, {
  description: {
    stringType: "longtext",
  },
});
export default CourseDescriptions;
