import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
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
  FormSubmit,
} from "@/components/Form";
import { signIn, signUp } from "@/logic/auth";
import UserRedirect from "@/components/UserRedirect";
import Footer from "@/components/Footer";
import Head from "next/head";

export default function SignupRoute({ isSignIn }) {
  return (
    <>
      <Head>
        <title>CSMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="CSMS Website" />
      </Head>

      <UserRedirect redirectOnUser>
        <>
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
                validationRules={[CONFIRM_PASSWORD]}
                initialValue={{
                  email: "",
                  password: "",
                }}
                onSubmit={isSignIn ? signIn : signUp}
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
                    name="rememberMe"
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
                <Grid container justifyContent="space-between" gap={2}>
                  <Grid item>
                    <Link
                      href={isSignIn ? "/signup" : "/login"}
                      variant="body2"
                    >
                      {isSignIn
                        ? "Don't have an account? Sign Up"
                        : "Already an account? Log In"}
                    </Link>
                  </Grid>
                  {isSignIn ? (
                    <Grid item>
                      <Link href={"/forgot-password"} variant="body2">
                        Forgot password
                      </Link>
                    </Grid>
                  ) : null}
                </Grid>
              </Box>
            </Box>
          </Container>
          <Footer />
        </>
      </UserRedirect>
    </>
  );
}
