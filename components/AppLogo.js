import appLogoPng from "@/assets/app_logo.png";
import Image from "next/image";
import Template from "./Template";
export default function AppLogo({ size, ...props }) {
  return (
    <Template
      as={Image}
      src={appLogoPng}
      alt="App logo"
      width={size}
      {...{ props }}
    />
  );
}
