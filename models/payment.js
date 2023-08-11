import { CountedItem, CountedModel } from "./counted_model";

class Payment extends CountedItem {
  name = "";
  description = "";
  amount = "";
  timestamp = 0;
  getDate() {
    const m = new Date(this.timestamp);
    return `${m.getDate()}/${m.getMonth()}/${m.getYear()}`;
  }
  getTime() {
    const m = new Date(this.timestamp);
    return m.toLocaleTimeString();
  }
}
const Payments = new CountedModel("payments", Payment);
export default Payments;
