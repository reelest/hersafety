import { Setting } from "iconsax-react";
import { useScrollPoint } from "../Overview";
import styles from "./home.module.css";
import { useDeviation } from "@/utils/useDeviation";
import { useRef } from "react";
export default function HomeTechStack() {
  const ref = useRef();
  useScrollPoint("Tech Stack", "Tech Stack", Setting, useDeviation(ref));
  return (
    <div ref={ref} className={`${styles.section}`}>
      <h2>My Stack</h2>
      <p className="font-md">
        Over the years, I have worked with a number of technologies.
      </p>
      <div className={`flex flex-wrap justify-start`}>
        <div className={styles.column}>
          <h3>Frontend Frameworks</h3>
          <ul className="font-md leading-relaxed p-0 px-4">
            <li>React</li>
            <li>React Native</li>
            <li>Flutter</li>
            <li>VueJS</li>
            <li>Android (Java / Kotlin)</li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Backend Frameworks</h3>
          <ul className="font-md leading-relaxed p-0 px-4">
            <li>NextJS / Express</li>
            <li>Django</li>
            <li>PHP</li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Databases</h3>
          <ul className="font-md leading-relaxed p-0 px-4">
            <li>MySQL</li>
            <li>Firebase</li>
            <li>Sanity CMS</li>
            <li>MongoDB</li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Web Servers</h3>
          <ul className="font-md leading-relaxed p-0 px-4">
            <li>Nginx</li>
            <li>Apache</li>
            <li>Gunicorn</li>
          </ul>
        </div>
      </div>
      {/* <i className="font-xs">
        * I am proficient in all of the above and have years of experience using
        them. However, the topmost items are the technologies I have used the
        most.
      </i> */}
    </div>
  );
}
