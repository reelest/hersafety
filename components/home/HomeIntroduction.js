import { m } from "framer-motion";
import HomeAppSketch from "./HomeAppSketch";
import Spacer from "@/components/Spacer";
export default function HomeIntroduction() {
  return (
    <div className="flex items-center flex-wrap">
      <div className="pr-4">
        <m.h2
          // style={{ maxWidth: "60vw" }}
          initial={{ opacity: 0.1 }}
          whileInView={{ opacity: 1, dur: 2 }}
        >
          Reimagine Software
        </m.h2>
        <m.div
          className="font-lg"
          initial={{ opacity: 0.1 }}
          whileInView={{ opacity: 1, dur: 2 }}
        >
          <p>
            <span className="mr-4">
              The best things in life are absolutely free.
            </span>
            <span className="font-xs">air, love, family.</span>
          </p>
          <p>Why should the best software be any different?</p>
        </m.div>
      </div>
      <div className="flex ml-auto">
        <HomeAppSketch />
      </div>
    </div>
  );
}
