import { IconButton, Modal, Paper, Typography } from "@mui/material";
import { useState } from "react";
import SuccessDialog from "./SuccessDialog";
import { CloseCircle } from "iconsax-react";
import { noop } from "@/utils/none";
import Form from "./Form";

export default function FormDialog({
  isOpen = false,
  closeOnSubmit,
  title,
  onSubmit,
  onClose = noop,
  as: As = Form,
  ...props
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Modal
      onClose={(e, reason) => {
        if (reason && reason == "backdropClick") return;
        onClose(e);
      }}
      open={isOpen}
      className="p-4 flex items-center"
    >
      {/* Modal must have only one child */}
      <Paper className="mx-auto max-h-full max-w-2xl pt-4 px-8 max-sm:px-4 overflow-auto pb-12 flex flex-col">
        <SuccessDialog
          open={submitted}
          onClose={() => {
            setSubmitted(false);
            if (closeOnSubmit) onClose();
          }}
        />
        <div className="text-right -mx-3.5 max-sm:-mx-0.5">
          <IconButton onClick={onClose}>
            <CloseCircle />
          </IconButton>
        </div>
        {title ? (
          <Typography variant="h4" sx={{ mb: 4 }}>
            {title}
          </Typography>
        ) : null}
        <As
          className="flex-grow flex flex-col"
          {...props}
          onSubmit={async (data) => {
            await onSubmit?.(data);
            setSubmitted(true);
          }}
        />
      </Paper>
    </Modal>
  );
}
