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

export default function RegistrationsForm({ isOpen = false, onClose = noop }) {
  return (
    <Modal onClose={onClose} open={isOpen} className="p-4">
      {/* Modal must have only one child */}
      <Paper className="h-full w-full mx-auto max-w-2xl pt-4 px-8 max-sm:px-4">
        <div className="text-right">
          <IconButton onClick={onClose}>
            <CloseCircle />
          </IconButton>
        </div>
        <Typography variant="h4">Register New Student</Typography>
        Form.....
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
      </Paper>
    </Modal>
  );
}
