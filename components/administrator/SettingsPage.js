import { Box, Select, Typography } from "@mui/material";
import PageHeader from "../PageHeader";

/*
Language
Default password for user accounts
Website Info

*/
export default function SettingsPage() {
  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <PageHeader title="User Dashboard" />
      <Box className="px-4 sm:px-8 py-8">
        <div className="flex flex-wrap justify-between">
          <Typography variant="h6" as="h2">
            Academics
          </Typography>
        </div>
        <div className="flex py-8 -mx-2"></div>
      </Box>
    </Box>
  );
}
