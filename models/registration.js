import { CountedItem, CountedTable } from "./counted_table";

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
}
const Registrations = new CountedTable("registrations", Registration);
export default Registrations;
