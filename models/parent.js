import { CountedModel } from "./counted_model";
import { UserModel } from "./user";

class Parent extends UserModel {}
const Parents = new CountedModel("parents", Parent);
export default Parents;
