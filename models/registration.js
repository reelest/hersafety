import { CountedModel } from "./lib/counted_model";
import { CountedItem } from "./lib/counted_item";
import { Class, Country, Gender } from "./lib/model_types";
export class Registration extends CountedItem {
  firstName = "";
  lastName = "";
  email = "";
  entranceClass = "";
  gender = "";
  dateOfBirth = new Date();
  stateOfOrigin = "";
  address = "";
  session = "";
  nationality = "";
  getName() {
    return `${this.firstName} ${this.lastName}`;
  }
  getClass() {
    return this.getPropertyLabel("entranceClass");
  }
}
const Registrations = new CountedModel("registrations", Registration, {
  gender: Gender,
  dateOfBirth: {
    type: "date",
  },
  nationality: Country,
  entranceClass: Class,
});
export default Registrations;
