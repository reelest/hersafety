import styles from "./home.module.css";
import whatsappIcon from "./assets/logos_whatsapp-icon.png";
import linkedInIcon from "./assets/skill-icons_linkedin.png";
import twitterIcon from "./assets/skill-icons_twitter.png";
import githubIcon from "./assets/github-mark.png";
import Image from "next/image";
import { useDeviation } from "@/utils/useDeviation";
import { Call } from "iconsax-react";
import { useScrollPoint } from "../Overview";
import { useRef } from "react";
export default function ContactMe() {
  const ref = useRef();
  useScrollPoint("Contact Me", "Contact Me", Call, useDeviation(ref));
  return (
    <div ref={ref} className={styles.section}>
      <h2>Get in Touch</h2>
      <div className="flex flex-wrap">
        <div
          className="flex items-center nowrap mb-8"
          style={{ marginRight: "5rem", flexBasis: "16.5rem" }}
        >
          <Image
            className="mr-4"
            src={whatsappIcon}
            width={36}
            alt="Whatsapp"
          />
          <a
            rel="noreferrer"
            target="_blank"
            href="tel:+2348107238901"
            className="link font-md"
          >
            +234 815 700 4401
          </a>
        </div>
        <div
          className="flex items-center nowrap mb-8"
          style={{ marginRight: "5rem", flexBasis: "16.5rem" }}
        >
          <Image
            className="mr-4"
            src={linkedInIcon}
            width={36}
            alt="LinkedIn"
          />
          <a
            href="https://www.linkedin.com/in/oro-owologba/"
            className="link font-md"
          >
            Connect on LinkedIn
          </a>
        </div>
        <div
          className="flex items-center nowrap mb-8"
          style={{ marginRight: "5rem", flexBasis: "16.5rem" }}
        >
          <Image className="mr-4" src={twitterIcon} width={36} alt="Twitter" />
          <a
            rel="noreferrer"
            target="_blank"
            href="https://twitter.com/rowend_duke"
            className="link font-md"
          >
            Follow me on Twitter
          </a>
        </div>
        <div
          className="flex items-center nowrap mb-8"
          style={{ marginRight: "5rem", flexBasis: "16.5rem" }}
        >
          <Image className="mr-4" src={githubIcon} width={36} alt="Github" />
          <a
            rel="noreferrer"
            target="_blank"
            href="https://github.com/rowend36"
            className="link font-md"
          >
            Follow me on Github
          </a>
        </div>
      </div>
    </div>
  );
}
