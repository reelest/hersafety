import useProjects from "@/logic/my_work";
import Image from "next/image";
import styles from "./home.module.css";
import { startTransition } from "react";
import useArrayState from "@/utils/useArrayState";
import useInterval from "@/utils/useInterval";
export default function HomeFeaturedProject() {
  const featured = useProjects().filter((e) => e.isFeatured);
  const [active, setActive] = useArrayState(featured);
  const [previous, setPrevious] = useArrayState(featured);
  const advance = () => {
    // console.log("Advancing " + Date.now());
    const e = featured[(featured.indexOf(active) + 1) % featured.length];
    if (e !== active) {
      startTransition(() => {
        setPrevious(active);
        setActive(e);
      });
    }
  };

  const skip = useInterval(advance, 9000);
  return (
    <div>
      <div
        className={`relative ${styles.aligned} mr-8 mb-4 flex items-center overflow-hidden`}
        style={{ borderRadius: "1rem", height: 300 }}
      >
        <Image
          key={active.title}
          onClick={() => {
            skip();
            advance();
          }}
          className={styles.featuredImage}
          src={active.previewImage}
          alt={active.title}
        />
        {previous && previous !== active ? (
          <Image
            key={previous.title}
            className={styles.fadeStub}
            src={previous.previewImage}
            alt={previous.title}
          />
        ) : null}
      </div>
      <i className="my-6">{active.briefDescription}</i>
    </div>
  );
}
