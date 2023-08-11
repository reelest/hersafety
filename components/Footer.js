import { formatPhoneNumber } from "@/utils/formatNumber";
import AppLogo from "./AppLogo";
import useWebsiteData from "@/logic/website_data";
import linkedInIcon from "@/assets/linkedIn.svg";
import facebookIcon from "@/assets/facebook.svg";
import twitterIcon from "@/assets/twitter.svg";
import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function Footer() {
  const website = useWebsiteData();
  return (
    <ThemeProvider
      theme={(theme) => {
        return createTheme(
          {
            palette: {
              mode: "dark",
            },
          },
          theme
        );
      }}
    >
      <Box className="text-white" bgcolor="black" sx={{ py: 2, px: 8 }}>
        <Container
          className="flex mx-auto flex-wrap max-lg:flex-col"
          sx={{ mt: 18 }}
        >
          <Box className="sm:basis-0 max-sm:w-full flex-grow flex items-center flex-col text-center">
            <AppLogo size={240} />
            <p className="font-20 mt-12">{website.description}</p>
          </Box>
          <Box sx={{ ml: 16 }} className="basis-1/2">
            <Typography
              variant="h5"
              className="border-l-8 border-primaryLight font-32b"
            >
              Contact Information
            </Typography>
            <Typography variant="h6" className="font-24b mt-6">
              Address:
            </Typography>
            <Typography paragraph>{website.address}</Typography>
            <Typography variant="h6" className="font-24b mt-6">
              Phone:
            </Typography>
            <Typography paragraph>
              {website.phone1Label} -{" "}
              <Link color="common.white" href={`tel:${website.phone1}`}>
                {formatPhoneNumber(website.phone1)}
              </Link>
            </Typography>
            {website.phone2Label ? (
              <Typography paragraph>
                {website.phone2Label} -{" "}
                <Link color="common.white" href={`tel:${website.phone2}`}>
                  {formatPhoneNumber(website.phone2)}
                </Link>
              </Typography>
            ) : null}
            <Typography variant="h6" className="font-24b mt-6">
              Email:
            </Typography>
            <Typography paragraph className="font-24 underline">
              <Link color="common.white" href={`mailto:${website.email}`}>
                {website.email}
              </Link>
            </Typography>
          </Box>
        </Container>
        <Typography
          variant="body2"
          // color="text.secondary"
          align="center"
          sx={{ mt: 16, mb: 8 }}
        >
          {"Copyright © "}
          <Link color="common.white" href="https://csmsuniben.web.app/">
            Festus Enabulele
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

const SocialBar = () => {
  const website = useWebsiteData();
  return (
    <div className="social-bar rounded mt-16 sm:mt-0 p-2 sm:p-3 sm:mx-6 md:mx-12 lg:mx-16 flex">
      <Link
        href={website.linkedInURL}
        className="block h-12 w-12 mx-2 sm:mx-3 my-2 sm:my-3"
      >
        <Image className="object-contain" src={linkedInIcon} alt="linkedIn" />
      </Link>
      <Link
        href={website.facebookURL}
        className="block h-12 w-12 mx-2 sm:mx-3 my-2 sm:my-3"
      >
        <Image className="object-contain" src={facebookIcon} alt="facebook" />
      </Link>
      <Link
        href={website.twitterURL}
        className="block h-12 w-12 mx-2 sm:mx-3 my-2 sm:my-3"
      >
        <Image className="object-contain" src={twitterIcon} alt="twitter" />
      </Link>
    </div>
  );
};
