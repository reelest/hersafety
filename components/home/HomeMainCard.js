import { useInfo } from "@/logic/info";
import styles from "./home.module.css";
import { m, useInView } from "framer-motion";
import { useDeviation } from "@/utils/useDeviation";
import { useEffect, useRef } from "react";

import { daysToMs } from "@/utils/time_utils";
import useAnimateX from "./useAnimateX";

export default function HomeMainCard() {
  const info = useInfo();
  const ref = useRef();
  const x = useAnimateX(useDeviation(ref));
  return (
    <m.div
      ref={ref}
      className={`${styles.subSection} flex flex-wrap items-center`}
      initial={{ x: 0 }}
      style={{ x }}
    >
      <div
        className="leading-relaxed"
        style={{
          // height: 250,
          width: 320,
          flexGrow: 1,
          fontSize: "var(--font-md)",
          // overflow: "hidden",
        }}
      >
        For me, <span className="primary">developing software</span> is more
        than just a professional career.
        <br /> It is my <span className="primary">God-given talent</span> and my
        way of contributing back to the world.
        <br /> <span className="tertiary">Building applications</span> is what I{" "}
        <span className="primary">love</span> doing. Let me handle it so you can
        focus on what you
        <span className="primary"> love</span> doing.
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h4>Bio</h4>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>
                  {info.name1}
                  <span style={{ color: "var(--tertiary-dark)" }}>
                    {' "'}
                    {info.name2}
                    {'" '}
                  </span>
                  {info.name3}
                </td>
              </tr>
              <tr>
                <td className="nowrap">Job Title:</td>
                <td>{info.jobTitle.join(", ")}</td>
              </tr>
              <tr>
                <td className="nowrap">Other Job Titles:</td>
                <td className="font-sm">{info.otherJobTitles.join(", ")}</td>
              </tr>
              <tr>
                <td className="nowrap">
                  Years of Experience
                  <br />
                  (Software Development)
                </td>
                <td>
                  <CountUpTimer from={info.yearsActive} />
                </td>
              </tr>
              <tr>
                <td className="nowrap">
                  Years of Experience
                  <br />
                  (Programming)
                </td>
                <td>
                  <CountUpTimer from={info.yearStarted} />
                </td>
              </tr>
              <tr>
                <td className="nowrap">Completed Projects</td>
                <td>14.0000000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </m.div>
  );
}

function CountUpTimer({ from }) {
  const ref = useRef();
  const inView = useInView(ref);
  useEffect(() => {
    if (ref.current && inView) {
      const el = ref.current;
      let p;
      const update = () => {
        const m = Date.now();
        el.innerText = ((m - from) / daysToMs(1) / 365.25).toFixed(7);
        p = requestAnimationFrame(update);
      };
      update();
      return () => cancelAnimationFrame(p);
    }
  });
  return <span ref={ref}></span>;
}
