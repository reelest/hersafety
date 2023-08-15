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
  CONFIRM_PASSWORD,
  FormErrors,
  FormField,
  FormRadio,
  FormSubmit,
  REQUIRED_EMAIL,
  REQUIRED_PASSWORD,
} from "@/components/Form";
import { signIn, signUp } from "@/logic/auth";
import UserRedirect from "@/components/UserRedirect";
import Footer from "@/components/Footer";
import Head from "next/head";

export default function SignUp({ isSignIn }) {
  return (
    <>
      <Head>
        <title>CSMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="CSMS Website" />
      </Head>

      <UserRedirect redirectOnUser>
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
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              {isSignIn ? "Sign In" : "Create Account"}
            </Typography>
            <Box
              component={Form}
              validationRules={{
                email: REQUIRED_EMAIL,
                password: REQUIRED_PASSWORD,
                ...(isSignIn ? {} : { confirmpassword: CONFIRM_PASSWORD }),
              }}
              initialValue={{
                email: "",
                password: "",
              }}
              onSubmit={isSignIn ? signIn : signUp}
              noValidate
              sx={{ mt: 2 }}
            >
              <FormErrors />
              <FormField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <FormField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete={isSignIn ? "current-password" : "new-password"}
              />
              {isSignIn ? (
                <FormField
                  type="checkbox"
                  color="primary"
                  label="Remember me"
                />
              ) : (
                <FormField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmpassword"
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                />
              )}
              <FormSubmit
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 6, mb: 4 }}
              >
                {isSignIn ? "Sign In" : "Create Account"}
              </FormSubmit>
              <Grid container>
                <Grid item>
                  <Link href={isSignIn ? "/signup" : "/login"} variant="body2">
                    {isSignIn
                      ? "Don't have an account? Sign Up"
                      : "Already an account? Log In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </UserRedirect>
      <Footer />
    </>
  );
}
