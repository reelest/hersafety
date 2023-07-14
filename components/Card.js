import Template from "@/components/Template";
import { useEffect, useRef } from "react";
import { useClickAway } from "react-use";
import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "@headlessui/react";
import createSubscription from "@/utils/createSubscription";
import { noop } from "@/utils/none";

const [, onShow, show] = createSubscription(noop);
/** @type {typeof BoxWrapper} */
export default function Box({ children, expand, ...props }) {
  return (
    <>
      <AnimatePresence>
        {expand ? (
          <Portal>
            <BoxWrapper {...props} expand>
              {children}
            </BoxWrapper>
          </Portal>
        ) : null}
      </AnimatePresence>
      <BoxWrapper {...props}>{expand ? null : children}</BoxWrapper>
    </>
  );
}

function BoxWrapper({
  bg = "white",
  expand,
  boxClass,
  onClose,
  children,
  ...props
}) {
  const ref = useRef();
  useEffect(() => {
    if (expand) {
      console.log("showing");
      show(ref);
      return onShow((_ref) => {
        console.log("hiding");
        if (ref !== _ref) onClose();
      });
    }
  }, [expand, onClose]);
  return (
    <>
      {expand ? <ClickAway target={ref} onClose={onClose} /> : null}
      <Template
        as={expand ? motion.div : "div"}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween" }}
        className={`shadow-1 print:shadow-none bg-${bg} ${
          expand
            ? "fixed top-12 left-5 bottom-0 right-5 rounded-t-2xl z-30 mb-0"
            : "relative rounded-2xl"
        }`}
        props={props}
      >
        <div
          ref={ref}
          className={`rounded-2xl bg-${bg} relative z-10 ${boxClass}`}
        >
          {children}
        </div>
      </Template>
    </>
  );
}

function ClickAway({ target, onClose }) {
  useClickAway(target, () => onClose?.());
  return null;
}
