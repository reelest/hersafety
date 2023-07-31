import { Typography, Paper } from "@mui/material";
import { SearchInput } from "./SearchInput";

export default function SectionHeader({ title, onSearch }) {
  return (
    <Paper
      className="flex px-6 py-2 h-15"
      sx={{ borderRadius: 0 }}
      elevation={2}
    >
      <Typography variant="h6" as="h1">
        {title}
      </Typography>
      <SearchInput />
    </Paper>
  );
}
