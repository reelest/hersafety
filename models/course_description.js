import Courses from "./course";
import { CountedItem } from "./lib/counted_item";
import { Model, Item } from "./lib/model";
import { DeleteItemAction, SetIDAction, trackRefs } from "./lib/trackRefs";

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
    trackRefs(
      this,
      ["assignments"],
      [new SetIDAction("descriptionId")],
      [new DeleteItemAction()]
    );
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
      // No circular references allowed
      type: "string",
      hidden: true,
    },
  },
});
export default CourseDescriptions;
