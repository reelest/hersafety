import { createTheme } from "@mui/material";
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
    background: {
      default: "#fdfdfd",
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
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "bold",
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  props: {
    MuiTooltip: {
      arrow: true,
    },
  },
});

export default theme;
