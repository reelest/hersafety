import Image from "next/image";
import AppLogo from "./AppLogo";
import Spacer from "./Spacer";
import Template from "./Template";
import logout from "../assets/logout.svg";
import settings from "../assets/settings.svg";
import { useClickAway } from "react-use";
import { useRef } from "react";
import { useRouter } from "next/router";
import { doLogout } from "@/logic/api";
import Link from "next/link";

export default function Sidebar({
  children,
  onClose,
  isOpen,
  isStatic = false,
  tabs = [],
}) {
  const selected = useRouter().query["tab"] || tabs[0]?.name?.toLowerCase?.();
  const ref = useRef();
  useClickAway(ref, onClose);
  return (
    <aside
      ref={isOpen && !isStatic ? ref : null}
      className={`${
        isStatic
          ? ""
          : "fixed z-30 will-change-transform" +
            (isOpen
              ? " transition-transform"
              : " transition-transform -translate-x-full")
      } bg-primaryDark text-white w-72 flex-shrink-0 h-full pt-12 pb-8"`}
    >
      <nav className="flex flex-col justify-start h-full">
        <AppLogo className="block mx-auto relative right-2 mb-8 w-1/2 px-4" />
        <div className="flex flex-col flex-grow overflow-auto px-4">
          {tabs.map(
            ({ icon, name, id = encodeURIComponent(name.toLowerCase()) }) => (
              <TabLink
                key={name}
                isSelected={id === selected}
                icon={icon}
                href={`?tab=${id}`}
              >
                {name}
              </TabLink>
            )
          )}
          <Spacer className="h-24 flex-shrink-0" />
          <TabLink isActivated icon={settings} href={"?tab=settings"}>
            Settings
          </TabLink>
          <TabLink isActivated icon={logout} as="button" onClick={doLogout}>
            Log out
          </TabLink>
        </div>
      </nav>
      {children}
    </aside>
  );
}

const TabLink = ({ icon, children, isSelected, isActivated, ...props }) => {
  return (
    <Template
      as={Link}
      {...{ props }}
      className={`block text-left whitespace-nowrap rounded-xl ${
        isSelected ? "bg-accent1" : isActivated ? "" : "text-white"
      } py-2 px-6 my-1.5 w-full`}
    >
      <Image
        src={icon}
        alt=""
        className="inline-block mr-4 align-middle"
        width={16}
        style={{
          filter:
            // isSelected || isActivated || true
            // ?
            "invert(100%)",
          // : "invert(43%) sepia(9%) saturate(7%) hue-rotate(0deg) brightness(92%) contrast(84%)",
        }}
      />
      {children}
    </Template>
  );
};
