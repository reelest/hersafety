import appLogoSvg from "@/assets/app_logo.svg";
import Image from "next/image";
import Template from "./Template";
export default function AppLogo({ size, ...props }) {
  return (
    <Template
      as={Image}
      src={appLogoSvg}
      alt="App logo"
      width={size}
      {...{ props }}
    />
  );
}
