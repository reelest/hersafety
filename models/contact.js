import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";

export class Contact extends CountedItem {
  name = "";
  phoneNumber = "";
  email = "";
  relationship = "unspecified";
  notifyInTimesOfDanger = false;
}

const Contacts = new CountedModel("contacts", Contact, {
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

export default Contacts;
