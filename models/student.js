import { CountedModel } from "./lib/counted_model";
import { HiddenField } from "./lib/model_types";
import { UserMeta, UserData } from "./user_data";

export class Student extends UserData {
  bloodGroup = "";
  genotype = "";
  medicalInfo = "";
  registrationId = "";
  parentId1 = "";
  parentId2 = "";
  getRole() {
    return "student";
  }
}

const Students = new CountedModel("students", Student, {
  ...UserMeta,
  registrationId: HiddenField,
  parentId1: HiddenField,
  parentId2: HiddenField,
  bloodGroup: {
    "!modelform-section": "Bio Data",
    required: false,
  },
  genotype: {
    "!modelform-section": "Bio Data",
    required: false,
  },
  medicalInfo: {
    "!modelform-section": "Bio Data",
    required: false,
  },
});

export default Students;
