import Box from "@mui/material/Box";
import TextInput from "@mui/material/OutlinedInput";
import { SearchNormal1 as SearchIcon } from "iconsax-react";

export function SearchInput() {
  return (
    <TextInput
      startAdornment={
        <Box as={SearchIcon} size={20} className="mr-3 text-inherit" />
      }
      placeholder="Search"
      sx={{
        flexGrow: 10,
        maxWidth: "27rem",
        backgroundColor: "gray.light",
      }}
      size="small"
    />
  );
}
