import { getUser } from "@/logic/auth";
import { CountedModel } from "./counted_model";
import { Item } from "./model";
import { Hidden } from "./model_types";

export class ActivationRequest extends Item {
  name = getUser()?.displayName ?? "";
  uid = getUser()?.uid;
  email = getUser()?.email;
  role = "";
  dateCreated = Date.now();
}
const ActivationRequests = new CountedModel(
  "activation_requests",
  ActivationRequest,
  {
    role: {
      options: [
        { value: "admin", label: "Administrator" },
        { value: "student", label: "Student" },
        { value: "teacher", label: "Teacher" },
      ],
    },
    uid: Hidden,
    email: Hidden,
    dateCreated: Hidden,
  }
);
export default ActivationRequests;
