import { CountedModel } from "./counted_model";
import { UserModelItem } from "./user";

export class Teacher extends UserModelItem {}
const Teachers = new CountedModel("teachers", Teacher);
export default Teachers;
