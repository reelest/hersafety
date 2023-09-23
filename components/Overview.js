import createSubscription from "@/utils/createSubscription";
import { useMotionValueEvent, m } from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./overview.module.css";

const positions = ["Home", "About Me", "Tech Stack", "Projects", "Contact Me"];
const links = ["#top", "#myname", "#stack", "#projects", "#links"];
let _scrollPoints;
const [useScrollPoints, onScrollPoints, setScrollPoints] = createSubscription();
setScrollPoints([]);

const registerScrollPoint = (item) => {
  setScrollPoints([..._scrollPoints, item]);
  return () => setScrollPoints(_scrollPoints.filter((e) => e !== item));
};

const [useActivePoint, , setActivePoint] = createSubscription();
const updateActiveScrollPoint = () => {
  _scrollPoints.sort(
    (a, b) => positions.indexOf(a.name) - positions.indexOf(b.name)
  );
  setActivePoint(
    _scrollPoints.length
      ? _scrollPoints.reduce((a, b) =>
          Math.abs(a.deviation) < Math.abs(b.deviation) ? a : b
        )
      : null
  );
};

onScrollPoints((e) => {
  _scrollPoints = e;
  updateActiveScrollPoint();
});

export const useScrollPoint = (name, title, icon, deviation) => {
  const p = useRef({ name, title, icon, deviation: 0 }).current;
  if (p.name !== name) p.name = name;
  if (p.icon !== icon) p.icon = icon;
  if (p.title !== title) p.title = title;

  useEffect(() => registerScrollPoint(p), [p]);
  useMotionValueEvent(deviation, "change", (e) => {
    p.deviation = e;
    updateActiveScrollPoint();
  });
};
export default function Overview() {
  const scrollPoints = useScrollPoints();
  const activePoint = useActivePoint();
  return (
    <m.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 5, delay: 5 }}
      className={`${styles.overview}`}
    >
      {scrollPoints.map(({ name, title, icon: Icon }) => {
        return (
          <a
            href={links[positions.indexOf(name)]}
            key={title}
            className={`cursor-pointer pt-4 pb-2 px-4 flex flex-col items-center justify-center ${
              styles.navItem
            } ${
              activePoint?.name === name ? styles.navItemActive : "primary-dark"
            }`}
          >
            {/* 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone' */}
            <Icon
              size={24}
              variant={activePoint?.name === name ? "Outline" : "Broken"}
            />
            <div className="text-center mt-2">{name}</div>
          </a>
        );
      })}
    </m.nav>
  );
}
