import { CountedModel } from "./counted_model";
import { UserModel } from "./user";

class Admin extends UserModel {}
const Admins = new CountedModel("administrators", Admin);
export default Admins;
