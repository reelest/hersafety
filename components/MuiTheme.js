import tailwindConfig from "@/tailwind.config";
import { createTheme } from "@mui/material/styles";
import Link from "next/link";
import React from "react";
/**Importing Tailwind into MUI since it is more lightweight and importing esmodules into commonjs is more difficult */
const tailWindTheme = tailwindConfig.theme.extend;
const LinkBehavior = React.forwardRef(function LinkBehaviour(props, ref) {
  const { href, ...other } = props;
  return <Link ref={ref} href={href} {...other} />;
});

const MuiTheme = createTheme({
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
    MuiFilledInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.gray.light,
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "transparent",
        },
        root: ({ theme }) => ({
          "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.dark,
            borderWidth: "2px",
          },
        }),
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: tailWindTheme.colors.primary,
      dark: tailWindTheme.colors.primaryDark,
      hover: "rgba(255, 255, 255, 0.3)",
    },
    secondary: {
      main: tailWindTheme.colors.secondary,
    },
    gray: {
      light: "#f0f0f5",
      main: "#777777",
      dark: "#9e9fa4",
    },
    background: {
      default: tailWindTheme.colors.bg,
    },
    text: {
      disabledOnPrimaryDark: tailWindTheme.colors.disabledOnPrimaryDark,
    },
    error: {
      main: tailWindTheme.colors.error,
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
    borderRadius: parseInt(tailWindTheme.borderRadius.DEFAULT),
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

export default MuiTheme;
