import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  useTheme,
} from "@mui/material";
import { Check, TickCircle } from "iconsax-react";

export default function SuccessDialog({ message, ...props }) {
  const theme = useTheme();

  return (
    <Dialog {...props}>
      <DialogContent className="flex items-center flex-col">
        <TickCircle
          size={120}
          variant="TwoTone"
          className="mt-4 animate-bounce"
          color={theme.palette.secondary.main}
          style={{
            animationIterationCount: 2,
          }}
        />
        <Typography variant="h5" as="h6" sx={{ mt: 4, mx: 8 }}>
          Successful
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 4, alignSelf: "start" }}
          color="text.disabled"
        >
          {message}
        </Typography>
        <Button color="secondary" onClick={props.onClose}>
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}
