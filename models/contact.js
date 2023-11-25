import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { UserData } from "./user_data";

export class Contact extends CountedItem {
  name = "";
  phoneNumber = "";
  email = "";
  relationship = "unspecified";
  notifyInTimesOfDanger = false;
}

/**
 *
 * @param {UserData} user
 * @returns
 */
export default function getContacts(user) {
  return new CountedModel(["contacts", "all", user.uid()], Contact, {
    email: {
      stringType: "email",
    },
    phoneNumber: {
      stringType: "tel",
    },
    relationship: {
      options: [
        "father",
        "mother",
        "sister",
        "brother",
        "uncle",
        "aunt",
        "boss",
        "son",
        "daughter",
        "relative",
        "unspecified",
      ],
    },
  });
}
