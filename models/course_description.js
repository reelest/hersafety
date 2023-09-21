import Courses from "./course";
import { CountedItem } from "./lib/counted_item";
import { Model } from "./lib/model";

export class CourseDescription extends CountedItem {
  name = "";
  description = "";
  assignments = [];
  async onUpdateItem(txn, newState, prevState) {
    if (
      this.didUpdate("name", newState, prevState) ||
      this.didUpdate("description", newState, prevState)
    )
      await Promise.all(
        newState.assignments.map(async (e) =>
          Courses.item(e).set(
            {
              description: newState.description,
              name: newState.name,
            },
            txn
          )
        )
      );
  }
  static {
    this.markTriggersUpdateTxn(["name", "description"], false);
  }
  //TODO: add a firestore rule to ensure that no description is deleted without all courses deleted
}
const CourseDescriptions = new Model("course_descriptions", CourseDescription, {
  description: {
    stringType: "longtext",
  },
  assignments: {
    arrayType: {
      type: "ref",
      refModel: null /*Course - No circular references allowed*/,
      hidden: true,
    },
  },
});
export default CourseDescriptions;
