import { noop } from "@/utils/none";
import {
  Box,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { CloseCircle } from "iconsax-react";
import Registrations from "@/models/registration";
import ModelForm from "../ModelForm";
import { useEffect, useRef, useState } from "react";

import SuccessDialog from "@/components/SuccessDialog";

export default function RegistrationsForm({
  isOpen = false,
  edit,
  onClose = noop,
}) {
  const [item, setItem] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setItem(isOpen ? edit || Registrations.create() : null);
  }, [edit, isOpen]);
  return (
    <Modal onClose={onClose} open={isOpen} className="p-4">
      {/* Modal must have only one child */}
      <Paper className="h-full w-full mx-auto max-w-2xl pt-4 px-8 max-sm:px-4 overflow-auto pb-12">
        <SuccessDialog
          open={submitted}
          onClose={() => {
            setSubmitted(false);
            if (!edit) onClose();
          }}
        />
        <div className="text-right -mx-3.5 max-sm:-mx-0.5">
          <IconButton onClick={onClose}>
            <CloseCircle />
          </IconButton>
        </div>
        <Typography variant="h4" sx={{ mb: 4 }}>
          {edit ? (
            <>Update Student Registration Info</>
          ) : (
            <>Register New Student</>
          )}
        </Typography>
        <ModelForm
          model={Registrations}
          item={item}
          onSubmit={() => setSubmitted(true)}
        />
      </Paper>
    </Modal>
  );
}
