import { CountedTable } from "./counted_table";
import { UserModel } from "./user";

class Teacher extends UserModel {}
const Teachers = new CountedTable("teachers", Teacher);
export default Teachers;
