import { CountedModel } from "./counted_model";
import { UserModelItem } from "./user";

export class Admin extends UserModelItem {}
const Admins = new CountedModel("administrators", Admin);
export default Admins;
