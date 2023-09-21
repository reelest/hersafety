import { noop } from "@/utils/none";
import Registrations from "@/models/registration";
import ModelFormDialog from "../ModelFormDialog";

export default function RegistrationsForm({
  isOpen = false,
  edit,
  onClose = noop,
}) {
  return (
    <ModelFormDialog
      model={Registrations}
      isOpen={isOpen}
      onClose={onClose}
      title={edit ? "Update Student Registration Info" : "Register New Student"}
    />
  );
}
