import styles from "./home.module.css";
import { useDeviation } from "@/utils/useDeviation";
import { m } from "framer-motion";
import { useRef } from "react";
import HomeFeaturedProject from "./HomeFeaturedProject";
import useAnimateX from "./useAnimateX";
import { useScrollPoint } from "../Overview";
import { ProfileCircle } from "iconsax-react";
import HomeMainCard from "./HomeMainCard";
export default function HomeMyName() {
  const ref = useRef();
  const rootRef = useRef();
  const x = useAnimateX(useDeviation(ref));
  useScrollPoint("About Me", "About Me", ProfileCircle, useDeviation(rootRef));
  return (
    <div className={styles.section} ref={rootRef}>
      <h2>About Me</h2>
      <m.div
        ref={ref}
        style={{ x, maxWidth: 1280 }}
        className={`flex items-center flex-wrap`}
      >
        <div
          style={{
            height: "auto",
            width: "50%",
            flexGrow: 1,
          }}
        >
          <HomeFeaturedProject />
        </div>
        <div
          className={`leading-relaxed ${styles.textBoxMyName}`}
          style={{ marginLeft: "auto" }}
        >
          <p>
            My name is{" "}
            <span style={{ color: "var(--primary-light)" }}>Ebenezer</span>, or
            just <span style={{ color: "var(--primary-light)" }}>Eben</span>.
            <br />
            <span style={{ wordBreak: "keep-all" }}>I enjoy building </span>
            <span
              style={{ color: "var(--primary-light)", wordBreak: "keep-all" }}
            >
              remarkable software.
            </span>
          </p>
          <p>
            <span>
              <span
                style={{
                  color: "var(--primary-light)",
                  marginLeft: "0.25em",
                  fontSize: "var(--font-lg)",
                  fontFamily: "Righteous",
                }}
              >
                REELEST
              </span>{" "}
              is the name of my brand.
            </span>
            <br />
            It stands for{" "}
            <span style={{ wordBreak: "keep-all" }}>
              <span
                style={{
                  color: "var(--primary-light)",
                  marginLeft: "0.25em",
                  fontSize: "var(--font-lg)",
                  fontFamily: "Righteous",
                }}
              >
                R
              </span>
              eliability
            </span>
            ,{" "}
            <span style={{ wordBreak: "keep-all" }}>
              <span
                style={{
                  color: "var(--primary-light)",
                  marginLeft: "0.25em",
                  fontSize: "var(--font-lg)",
                  fontFamily: "Righteous",
                }}
              >
                E
              </span>
              fficiency
            </span>
            ,{" "}
            <span style={{ wordBreak: "keep-all" }}>
              <span
                style={{
                  color: "var(--primary-light)",
                  marginLeft: "0.25em",
                  fontSize: "var(--font-lg)",
                  fontFamily: "Righteous",
                }}
              >
                E
              </span>
              ffectiveness
            </span>
            ,{" "}
            <span style={{ wordBreak: "keep-all" }}>
              <span
                style={{
                  color: "var(--primary-light)",
                  marginLeft: "0.25em",
                  fontSize: "var(--font-lg)",
                  fontFamily: "Righteous",
                }}
              >
                L
              </span>
              oveliness
            </span>
            ,{" "}
            <span style={{ wordBreak: "keep-all" }}>
              <span
                style={{
                  color: "var(--primary-light)",
                  marginLeft: "0.25em",
                  fontSize: "var(--font-lg)",
                  fontFamily: "Righteous",
                }}
              >
                E
              </span>
              conomy
            </span>
            ,{" "}
            <span style={{ wordBreak: "keep-all" }}>
              <span
                style={{
                  color: "var(--primary-light)",
                  marginLeft: "0.25em",
                  fontSize: "var(--font-lg)",
                  fontFamily: "Righteous",
                }}
              >
                S
              </span>
              ecurity
            </span>{" "}
            and{" "}
            <span style={{ wordBreak: "keep-all" }}>
              <span
                style={{
                  color: "var(--primary-light)",
                  marginLeft: "0.25em",
                  fontSize: "var(--font-lg)",
                  fontFamily: "Righteous",
                }}
              >
                T
              </span>
              echnological Innovation.
            </span>
          </p>
          <p></p>
        </div>
      </m.div>
      <HomeMainCard />
    </div>
  );
}
