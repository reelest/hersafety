import { Heart } from "iconsax-react";

export default function AppFooter() {
  return (
    <div
      className="flex font-sm text-white pt-2 pb-1 items-center justify-center"
      style={{ background: "var(--primary-dark)", letterSpacing: "0.075em" }}
    >
      Made with love
      <Heart
        variant="Bold"
        fontSize={20}
        className="mx-2"
        color="var(--secondary)"
      />{" "}
      by{" "}
      <span style={{ fontFamily: "Righteous" }} className="ml-1">
        REELEST
      </span>
    </div>
  );
}
