import { useDeviation } from "@/utils/useDeviation";
import { useTransform, m } from "framer-motion";
import { useRef } from "react";
import styles from "./home.module.css";
import Image from "next/image";
// import { Dialog } from "@headlessui/react";
import useProjects from "@/logic/my_work";
import { useScrollPoint } from "../Overview";
import { Briefcase } from "iconsax-react";
import useAnimateX from "./useAnimateX";
import useBreakpoints from "@/utils/useBreakpoints";
export default function HomePortfolio() {
  const ref = useRef();
  const projects = useProjects();
  useScrollPoint("Projects", "Projects", Briefcase, useDeviation(ref));
  return (
    <div ref={ref} className={styles.section}>
      <h2>Selected Projects</h2>
      {projects.map((e, i) => (
        <Project key={e.title} {...e} first={i === 0} />
      ))}
    </div>
  );
}

function Project({
  title,
  description,
  previewImage,
  // otherImages = [],
  link,
  first,
}) {
  const ref = useRef();
  const translateY = useDeviation(ref);
  const x = useAnimateX(translateY);
  const opacity = useTransform(translateY, [1, 0.75, -0.75, -1], [0, 1, 1, 0]);
  // const [showSlide, setShowSlide] = useState(false);
  const isMobile = useBreakpoints().xs;
  return (
    <m.div
      ref={ref}
      className={`${
        first || isMobile ? styles.subSection : styles.section
      } flex flex-wrap items-center`}
      initial={{ x: 0 }}
      style={{ x, opacity }}
    >
      <Image
        // onClick={() => otherImages && otherImages.length && setShowSlide(true)}
        className={styles.aligned}
        style={{
          marginRight: "auto",
          width: 720,
          height: "auto",
          borderRadius: "1rem",
          boxShadow: "rgba(0, 0, 0, 0.04) 3px 3px 18px 0px",
        }}
        src={previewImage}
        alt={title}
      />
      <div style={{ width: "4rem", visibility: "hidden" }} />
      <div
        className={`flex-grow ${styles.aligned}`}
        style={{ marginRight: "auto", width: 320 }}
      >
        <h3 className="font-xl">{title}</h3>
        <p className="leading-relaxed" style={{ textAlign: "justify" }}>
          {description}
        </p>
        {link ? (
          <a rel="noreferrer" target="_blank" href={link}>
            Click here to view
          </a>
        ) : null}
      </div>
      {/* <Dialog
        open={showSlide}
        onClose={() => {
          setShowSlide(false);
        }}
      >
        {showSlide && otherImages.join(",")}
      </Dialog> */}
    </m.div>
  );
}
