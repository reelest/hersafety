import "./globals.css";
import "@fontsource/inter";
import "@fontsource/poppins";
import { ThemeProvider } from "@emotion/react";
import theme from "../components/MuiTheme";
export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
