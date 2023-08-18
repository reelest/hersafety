import { CountedItem, CountedModel } from "./counted_model";
import { Class, Country, Gender } from "./model_types";
export class Registration extends CountedItem {
  firstName = "";
  lastName = "";
  email = "";
  entranceClass = "";
  gender = "";
  dateOfBirth = "";
  stateOfOrigin = "";
  address = "";
  session = "";
  nationality = "";
  getName() {
    return `${this.firstName} ${this.lastName}`;
  }
  getClass() {
    return this.getString("entranceClass");
  }
}
const Registrations = new CountedModel("registrations", Registration, null, {
  gender: Gender,
  dateOfBirth: {
    type: "date",
  },
  nationality: Country,
  entranceClass: Class,
});
export default Registrations;
