import Header from "@/components/Header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Head from "next/head";

export default function Guest() {
  return (
    <>
      <Head>
        <title>CSMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="CSMS Website" />
      </Head>
      <Header />

      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 16,
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h1">
            Oops, we do not know who you are.
          </Typography>
          <Typography fontSize={32} sx={{ mx: 10, my: 10 }}>
            Please, contact the system administrator to assign you a role.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
