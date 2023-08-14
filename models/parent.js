import { CountedTable } from "./counted_table";
import { UserModel } from "./user";

class Parent extends UserModel {}
const Parents = new CountedTable("parents", Parent);
export default Parents;
