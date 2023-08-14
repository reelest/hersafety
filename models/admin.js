import { CountedTable } from "./counted_table";
import { UserModel } from "./user";

class Admin extends UserModel {}
const Admins = new CountedTable("administrators", Admin);
export default Admins;
