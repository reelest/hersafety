import { CountedItem, CountedModel } from "./counted_model";

export class Registration extends CountedItem {
  firstName = "";
  lastName = "";
  entranceClass = "";
  gender = "";
  getName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
const Registrations = new CountedModel("registrations", Registration);
export default Registrations;
