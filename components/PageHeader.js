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
import useBreakpoints from "@/utils/useBreakpoints";
import { setSidebar } from "./Sidebar";
import useUserData from "@/logic/user_data";
import sentenceCase from "@/utils/sentenceCase";
export default function PageHeader({ title, onSearch }) {
  const user = useUserData();
  return (
    <Paper
      className="flex max-sm:flex-wrap px-4 sm:px-8 h-15 items-center justify-end py-2"
      sx={{
        borderRadius: 0,
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      }}
      elevation={1}
    >
      <Box
        className="w-full sm:w-auto justify-between items-center flex"
        sx={{ mr: { sm: 8 }, my: { xs: 2, sm: 0 } }}
      >
        <Hidden lgUp>
          <IconButton
            className="relative -left-2"
            onClick={() => {
              setSidebar(true);
            }}
          >
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
      <Box
        className="flex justify-between items-center"
        sx={{ ml: { xs: 2, sm: 8 } }}
      >
        <Hidden xlDown>
          <div className="text-right">
            <Typography sx={{ fontWeight: "bold" }}>
              {user ? user.getName() ?? "No name provided" : <Skeleton />}
            </Typography>
            <Typography variant="body2">
              {user ? sentenceCase(user.getRole()) : <Skeleton />}
            </Typography>
          </div>
        </Hidden>
        <Hidden smDown>
          <Avatar className="ml-4" />
        </Hidden>
      </Box>
    </Paper>
  );
}
