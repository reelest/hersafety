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
      } ,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#170dd8',
    },
    secondary: {
      main: '#ff8200',
    },
    background: {
      default: '#fdfdfd',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 4,
  },
  overrides: {
    MuiButton: {
      root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
      },
    },
  },
  spacing: 8,
  props: {
    MuiTooltip: {
      arrow: true,
    },
  }
});

export default theme;