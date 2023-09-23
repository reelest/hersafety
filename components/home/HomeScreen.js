import { Home } from "iconsax-react";
import Overview, { useScrollPoint } from "../Overview";
import HomeIntroduction from "./HomeIntroduction";
import styles from "./home.module.css";
import { useDeviation } from "@/utils/useDeviation";
import TitleAnimation from "./TitleAnimation";
import HomeMyName from "./HomeMyName";
import HomeTechStack from "./HomeTechStack";
import HomePortfolio from "./HomePortfolio";
import HomeAgencies from "./HomeAgencies";
import ContactMe from "./HomeContactMe";
import { useRef } from "react";
import FramerParallaxLayer from "../FramerParallaxLayer";
import ParticlesLayer from "../ParticlesLayer";
import AppFooter from "../AppFooter";
if (typeof window !== "undefined") window.location.hash = "";

export default function HomeScreen() {
  const ref = useRef();
  useScrollPoint("Home", "Home", Home, useDeviation(ref));
  return (
    <main className="root">
      <FramerParallaxLayer>
        <ParticlesLayer />
      </FramerParallaxLayer>
      <div
        ref={ref}
        className={`${styles.main} flex justify-center flex-col items-center app-padding`}
      >
        <h1 style={{ margin: 0 }}>
          <TitleAnimation />
        </h1>
        <span>There is something here.</span>
      </div>

      <Overview />
      <div style={{ overflowX: "hidden" }} className="app-padding">
        <HomeIntroduction />
        <span id="myname" className="section-link"></span>
        <HomeMyName />
        <HomeAgencies />
        <span id="stack" className="section-link"></span>
        <HomeTechStack />
        <span id="projects" className="section-link"></span>
        <HomePortfolio />
        <span id="links" className="section-link"></span>
        <ContactMe />
        <div className={styles.section} />
        {/* <AppFooter /> */}
      </div>
    </main>
  );
}
