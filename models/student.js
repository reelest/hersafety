import { CountedModel } from "./lib/counted_model";
import { Hidden } from "./lib/model_types";
import { UserMeta, UserModelItem } from "./user";

export class Student extends UserModelItem {
  bloodGroup = "";
  genotype = "";
  disability = "";
  registrationId = "";
  parentId1 = "";
  parentId2 = "";
  getRole() {
    return "student";
  }
}

const Students = new CountedModel("students", Student, {
  ...UserMeta,
  registrationId: Hidden,
  parentId1: Hidden,
  parentId2: Hidden,
  bloodGroup: {
    "!modelform-section": "Bio Data",
    required: false,
  },
  genotype: {
    "!modelform-section": "Bio Data",
    required: false,
  },
  disability: {
    "!modelform-section": "Bio Data",
    required: false,
  },
});

export default Students;
