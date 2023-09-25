import { Box, Typography } from "@mui/material";
export default function AppLogo({ size, ...props }) {
  return (
    <Box class="flex justify-center my-2">
      <div className="rounded-full bg-secondary px-6 py-4">
        <Typography variant="titleMedium" sx={{ color: "white" }}>
          MOUOA
        </Typography>
      </div>
    </Box>
  );
}
