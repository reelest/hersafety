import Image from "next/image";
import AppLogo from "./AppLogo";
import Spacer from "./Spacer";
import Template from "./Template";
import { useClickAway } from "react-use";
import { useRef } from "react";
import { useRouter } from "next/router";
import { doLogout } from "@/logic/api";
import { Setting, Logout } from "iconsax-react";
import {
  Box,
  useTheme,
  Link,
  Typography,
  SwipeableDrawer,
  Button,
} from "@mui/material";

export function useActiveTab(tabs) {
  return useRouter().query["tab"] || tabs[0]?.name?.toLowerCase?.();
}
export default function Sidebar({
  children,
  onClose,
  onOpen,
  isOpen,
  isStatic = false,
  tabs = [],
}) {
  const selected = useActiveTab(tabs);
  return (
    <SwipeableDrawer
      onOpen={onOpen}
      onClose={onClose}
      variant={isStatic ? "permanent" : "temporary"}
      open={isOpen}
      sx={{
        "&>.MuiPaper-root": {
          backgroundColor: "primary.dark",
          position: isStatic ? "static" : "fixed",
        },
      }}
    >
      <nav className="text-white w-72 flex-shrink-0 pt-4 pb-8 flex flex-col justify-start h-full">
        <AppLogo className="block mx-auto relative right-2 mb-16 h-6 w-auto px-4" />
        <div className="flex flex-col flex-grow overflow-auto pl-8 pr-6">
          {tabs.map(
            ({ icon, name, id = encodeURIComponent(name.toLowerCase()) }) => (
              <TabLink
                key={name}
                isSelected={id === selected}
                icon={icon}
                href={`?tab=${id}`}
              >
                {name}
              </TabLink>
            )
          )}
          <Spacer className="h-8 flex-shrink-0" />
          <TabLink icon={Setting} href={"?tab=settings"}>
            Settings
          </TabLink>
          <TabLink
            isActivated
            icon={Logout}
            as={Box}
            component="button"
            onClick={doLogout}
          >
            Log out
          </TabLink>
        </div>
      </nav>
      {children}
    </SwipeableDrawer>
  );
}

const TabLink = ({
  icon: Icon,
  children,
  isSelected,
  isActivated,
  ...props
}) => {
  const theme = useTheme();
  return (
    <Template
      as={Link}
      props={props}
      className={`block text-left whitespace-nowrap rounded-xl py-2 px-4 w-full`}
      sx={{
        marginTop: "0.375rem",
        marginBottom: "0.375rem",
        textDecoration: "none",
        backgroundColor: isSelected ? "primary.light" : "",
        color: isActivated
          ? "white"
          : isSelected
          ? "white"
          : "text.disabledOnPrimaryDark",
        "&:hover": {
          backgroundColor: isSelected ? "" : "primary.hover",
        },
      }}
    >
      <Typography>
        <Box
          as={Icon}
          size={24}
          sx={{
            color: isActivated
              ? "white"
              : isSelected
              ? "white"
              : "text.disabledOnPrimaryDark",
          }}
          className="inline-block align-bottom mr-4"
        />
        {children}
      </Typography>
    </Template>
  );
};
