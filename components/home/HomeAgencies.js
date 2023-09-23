import Image from "next/image";
import styles from "./home.module.css";
import kupon from "./assets/kupon.png";
import rexdreams from "./assets/rexdreams.png";
import teknesis from "./assets/teknesis.png";
import Spacer from "../Spacer";
export default function HomeAgencies() {
  return (
    <div className={styles.section}>
      <h2>Brands I work with</h2>
      <div
        className="flex flex-wrap items-stretch w-full"
        style={{ justifyContent: "space-evenly" }}
      >
        <p className={styles.brandItem}>
          <Spacer />
          <Image width={220} src={teknesis} alt="teknesis" />
          <Spacer />
          <a rel="noreferrer" target="_blank" className="mt-6 link text-center">
            Teknesis Brand
          </a>
        </p>
        <p className={styles.brandItem}>
          <Spacer />
          <Image height={84} src={rexdreams} alt="rexdreams" />
          <Spacer />
          <a
            rel="noreferrer"
            target="_blank"
            className="mt-6 link text-center"
            href="https://rexdreams.com"
          >
            Rexdreams
          </a>
        </p>
        <p className={styles.brandItem}>
          <Spacer />
          <Image width={220} src={kupon} alt="kupon" />
          <Spacer />
          <a
            rel="noreferrer"
            target="_blank"
            className="mt-6 link text-center"
            href="https://kupon.com.ng"
          >
            Kupon Logistics
          </a>
        </p>
      </div>
    </div>
  );
}
