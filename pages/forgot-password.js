import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Lock as LockOutlinedIcon } from "iconsax-react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Form, {
  FormErrors,
  FormField,
  FormSubmit,
  REQUIRED_EMAIL,
  REQUIRED_PASSWORD,
} from "@/components/Form";
import { resetPassword, signIn } from "@/logic/auth";
import UserRedirect from "@/components/UserRedirect";
import Footer from "@/components/Footer";
import Head from "next/head";
import Header from "@/components/Header";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>CSMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="CSMS Website" />
      </Head>
      <Header />

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 32,
            marginBottom: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
            Reset Password
          </Typography>
          <Box
            component={Form}
            validationRules={{
              email: REQUIRED_EMAIL,
            }}
            initialValue={{
              email: "",
            }}
            onSubmit={resetPassword}
            noValidate
            sx={{ mt: 2 }}
          >
            <FormErrors />
            <FormField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <FormSubmit
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 6, mb: 4 }}
            >
              Sign In
            </FormSubmit>
            <Grid container>
              <Grid item xs>
                <Link href="/login" variant="body2">
                  Login
                </Link>
              </Grid>
              <Grid item>
                <Link href="/forgot-password" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <UserRedirect redirectOnUser />
      <Footer />
    </>
  );
}
