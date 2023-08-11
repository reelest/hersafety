import { createTheme } from "@mui/material/styles";
import Link from "next/link";
import React from "react";

const LinkBehavior = React.forwardRef(function LinkBehaviour(props, ref) {
  const { href, ...other } = props;
  return <Link ref={ref} href={href} {...other} />;
});

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#170dd8",
      dark: "#070441",
      hover: "rgba(255, 255, 255, 0.3)",
    },
    secondary: {
      main: "#ff8200",
    },
    gray: {
      light: "#f2f2f5",
      main: "#777777",
    },
    background: {
      default: "#fafafd",
    },
    text: {
      disabledOnPrimaryDark: "#aeafb5",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
      fontSize: "4.214rem",
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
      fontSize: "3.161rem",
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
      fontSize: "2.37rem",
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
      fontSize: "1.78rem",
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
      fontSize: "1.33333333rem",
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
      fontSize: "1.1666666rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 4, //Match the spacing scale of tailwind when fontSize is 16px
  props: {
    MuiTooltip: {
      arrow: true,
    },
  },
  breakpoints: {
    // Match tailwind breakpoints
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
  },

  shadows: [
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ],
});

export default theme;
