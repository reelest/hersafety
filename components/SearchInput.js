import TextInput from "@mui/material/FilledInput";
import { SearchNormal1 as SearchIcon } from "iconsax-react";

export function SearchInput() {
  return (
    <TextInput
      startAdornment={<SearchIcon size={24} />}
      placeholder="Search"
      variant="search"
      className="pl-14 pr-6"
      sx={{ lineHeight: "normal" }}
    />
  );
}
