import "./globals.css";
import "@fontsource/inter";
import "@fontsource/poppins";
import { ThemeProvider } from "@mui/material/styles";
import MuiTheme from "../components/MuiTheme";
import { CssBaseline } from "@mui/material";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={MuiTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
