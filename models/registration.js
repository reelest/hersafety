import { CountedItem, CountedModel } from "./counted_model";

export class Registration extends CountedItem {
  static Meta = {
    email: {},
  };
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
}
const Registrations = new CountedModel("registrations", Registration);
export default Registrations;
