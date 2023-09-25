import { IconButton, Modal, Paper, Typography } from "@mui/material";
import { useEffect, useId, useState } from "react";
import SuccessDialog from "./SuccessDialog";
import { CloseCircle } from "iconsax-react";
import ModelForm from "./ModelForm";
import { noop } from "@/utils/none";
import useLogger from "@/utils/useLogger";
import FormDialog from "./FormDialog";

export default function ModelFormDialog({
  isOpen = false,
  edit,
  closeOnSubmit = !edit,
  model: Model,
  noSave,
}) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    setItem(isOpen ? edit || (noSave ? null : Model.create()) : null);
  }, [edit, isOpen, Model, noSave]);
  const id = useId();
  useLogger({ item, id, dialog: isOpen });

  return (
    <FormDialog
      isOpen={isOpen}
      as={ModelForm}
      model={Model}
      item={item}
      noSave={noSave}
      closeOnSubmit={closeOnSubmit}
    />
  );
}
