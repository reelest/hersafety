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
import { useRef } from "react";
export default function RegistrationsForm({ isOpen = false, onClose = noop }) {
  const item = useRef();
  if (!item.current) {
    item.current = Registrations.create();
  }
  return (
    <Modal onClose={onClose} open={isOpen} className="p-4">
      {/* Modal must have only one child */}
      <Paper className="h-full w-full mx-auto max-w-2xl pt-4 px-8 max-sm:px-4">
        <div className="text-right -mx-3.5 max-sm:-mx-0.5">
          <IconButton onClick={onClose}>
            <CloseCircle />
          </IconButton>
        </div>
        <Typography variant="h4">Register New Student</Typography>
        <ModelForm model={Registrations} item={item.current} />
      </Paper>
    </Modal>
  );
}
