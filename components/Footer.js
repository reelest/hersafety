import { formatPhoneNumber } from "@/utils/formatNumber";
import AppLogo from "./AppLogo";
import useWebsiteData from "@/logic/website_data";
import linkedInIcon from "@/assets/linkedIn.svg";
import facebookIcon from "@/assets/facebook.svg";
import twitterIcon from "@/assets/twitter.svg";
import Image from "next/image";

export default function Footer() {
  const website = useWebsiteData();
  return (
    <div className="bg-primaryDark text-white px-8 sm:px-10 md:px-20">
      <div className="container flex mx-auto py-24 flex-wrap max-lg:flex-col">
        <div className="sm:mx-6 md:mx-12 lg:mx-16 my-10 flex-grow sm:basis-0 max-sm:w-full flex items-center flex-col text-center">
          <AppLogo size={240} />
          <p className="font-20 mt-12">{website.description}</p>
        </div>
        <div className="my-10 flex-grow basis-72 flex items-center max-sm:flex-col">
          <div className="sm:mx-6 md:mx-12 lg:mx-16 flex-grow">
            <h2 className="border-l-8 border-primaryLight font-32b pl-4">
              Contact Information
            </h2>
            <h3 className="font-24b mt-6">Address:</h3>
            <p className="font-24">{website.address}</p>
            <h3 className="font-24b mt-6">Phone:</h3>
            <p className="font-24">
              {website.phone1Label} -{" "}
              <a href={`tel:${website.phone1}`}>
                {formatPhoneNumber(website.phone1)}
              </a>
            </p>
            {website.phone2Label ? (
              <p className="font-24">
                {website.phone2Label} -{" "}
                <a href={`tel:${website.phone2}`}>
                  {formatPhoneNumber(website.phone2)}
                </a>
              </p>
            ) : null}
            <h3 className="font-24b mt-6">Email:</h3>
            <p className="font-24 underline">
              <a href={`mailto:${website.email}`}>{website.email}</a>
            </p>
          </div>
          <SocialBar />
        </div>
      </div>
    </div>
  );
}

const SocialBar = () => {
 const website = useWebsiteData();
	return (
    <div className="social-bar rounded mt-16 sm:mt-0 p-2 sm:p-3 sm:mx-6 md:mx-12 lg:mx-16 max-sm:flex">
      <a
        href={website.linkedInURL}
        className="block h-12 w-12 mx-2 sm:mx-3 my-2 sm:my-3"
      >
        <Image className="object-contain" src={linkedInIcon} alt="linkedIn" />
      </a>
      <a
        href={website.facebookURL}
        className="block h-12 w-12 mx-2 sm:mx-3 my-2 sm:my-3"
      >
        <Image className="object-contain" src={facebookIcon} alt="facebook" />
      </a>
      <a
        href={website.twitterURL}
        className="block h-12 w-12 mx-2 sm:mx-3 my-2 sm:my-3"
      >
        <Image className="object-contain" src={twitterIcon} alt="twitter" />
      </a>
    </div>
  );
};
