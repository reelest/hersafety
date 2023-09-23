import Typist from "react-typist";
import ParallaxLayer from "../../components/ParallaxLayer";
import useWindowSize from "../../helpers/useWindowSize";
import Stars from "./Stars";

export default function LandingSection() {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  return (
    <div className="z-index-0 h-landing pb-8 pt-12 flex flex-col justify-center items-center">
      <ParallaxLayer>
        <Stars width={windowWidth} height={windowHeight} />
      </ParallaxLayer>
      <div className="rotate-3d-wrapper h-1/3 sm:h-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Reelest Studios Logo"
          className="rotate-3d h-full w-full object-contain object-center"
          src="./logo512.png"
        ></img>
      </div>
      <h1 className="text-4xl sm:text-6xl text-center px-10 pt-10 min-height-3-lines sm:min-height-2-lines md:min-height-1-line">
        <Typist avgTypingDelay={35} cursor={{ show: false }}>
          <span>This is it. </span>
          <Typist.Backspace count={5} delay={2000} />
          <Typist.Delay ms={1000} />
          <span> what you were searching for. </span>
          <Typist.Backspace count={37} delay={2000} />
          <Typist.Delay ms={1000} />
          <span>So look no further.</span>
          <Typist.Backspace count={19} delay={3000} />
          <Typist.Delay ms={1000} />
          <span>
            Reelest Studios is at your{" "}
            <span className="text-pulse">service.</span>
          </span>{" "}
        </Typist>
      </h1>
      <p className="mx-8 my-4">
        The <span className="text-green-500 font-bold">best</span> websites,
        mobile and web applications, smart contracts, data analysis,
        application-specific software, delivered to{" "}
        <span className="text-blue-500 font-bold">you</span> in record time.
      </p>
      <div className="flex justify-center mt-6">
        <button className="py-4 px-7 bg-green-500 text-white rounded-md text-sm font-medium">
          Contact Us
        </button>
      </div>
    </div>
  );
}
