import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { More } from "iconsax-react";
import Skeleton from "@mui/material/Skeleton";
export default function Card2({ icon: Icon, color = "#dbdbdf", label, value }) {
  return (
    <Paper
      className="flex items-start justify-between mx-2"
      elevation={2}
      sx={{ backgroundColor: color, minWidth: "12rem" }}
    >
      <div className="p-4 pb-2">
        <Box
          sx={{
            backgroundColor: "primary.dark",
            p: 1,
            borderRadius: "50%",
            width: 24,
            mb: 1,
          }}
        >
          <Icon size={16} color="white" />
        </Box>
        <Typography variant="caption">
          {label ?? <Skeleton width={200} />}
        </Typography>
        <Typography variant="h5" as="h3" sx={{ my: 1 }}>
          {value ?? <Skeleton width="100%" />}
        </Typography>
      </div>
      <IconButton>
        <More />
      </IconButton>
    </Paper>
  );
}
