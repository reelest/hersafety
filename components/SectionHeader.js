import {
  Typography,
  Paper,
  Avatar,
  Skeleton,
  Box,
  Hidden,
  IconButton,
} from "@mui/material";
import { SearchInput } from "./SearchInput";
import Spacer from "./Spacer";
import { HambergerMenu, Menu } from "iconsax-react";
import { useUser } from "@/logic/auth";
export default function SectionHeader({ title, onSearch }) {
  const user = useUser();
  return (
    <Paper
      className="flex max-sm:flex-wrap px-4 sm:px-8 h-15 items-center justify-end py-2"
      sx={{
        borderRadius: 0,
        backgroundColor: "background.default",
        borderBottom: "1px solid #dddddd",
      }}
      elevation={2}
    >
      <Box
        className="w-full sm:w-auto justify-between items-center flex"
        sx={{ mr: { sm: 8 }, my: { xs: 2, sm: 0 } }}
      >
        <Hidden smUp>
          <IconButton>
            <HambergerMenu />
          </IconButton>
        </Hidden>
        <Typography variant="h5" as="h1">
          {title}
        </Typography>
        <Hidden smUp>
          <Avatar />
        </Hidden>
      </Box>
      <Spacer style={{ width: "1px" }} />
      <SearchInput />
      <Spacer style={{ width: "1px" }} />
      <Hidden smDown>
        <Box
          className="flex justify-between items-center"
          sx={{ ml: { xs: 2, sm: 8 } }}
        >
          <div className="text-right">
            <Typography sx={{ fontWeight: "bold" }}>
              {user ? user.displayName ?? "No name provided" : <Skeleton />}
            </Typography>
            <Typography variant="body2">
              {user ? user.role ?? "No role provided" : <Skeleton />}
            </Typography>
          </div>
          <Avatar className="ml-4" />
        </Box>
      </Hidden>
    </Paper>
  );
}
