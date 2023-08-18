import Template from "@/components/Template";
import { useEffect, useRef } from "react";
import { useClickAway } from "react-use";
import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "@headlessui/react";
import createSubscription from "@/utils/createSubscription";
import { noop } from "@/utils/none";
import { Box, Paper } from "@mui/material";

const [, onShow, show] = createSubscription(noop);
/** @type {typeof Card1Wrapper} */
export default function Card1({ children, expand, ...props }) {
  return (
    <>
      <AnimatePresence>
        {expand ? (
          <Portal>
            <Card1Wrapper {...props} expand>
              {children}
            </Card1Wrapper>
          </Portal>
        ) : null}
      </AnimatePresence>
      <Card1Wrapper {...props}>{expand ? null : children}</Card1Wrapper>
    </>
  );
}

function Card1Wrapper({ expand, boxClass, onClose, children, ...props }) {
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
        as={Paper}
        elevation={2}
        templateAs={expand ? motion.div : "div"}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween" }}
        sx={{
          backgroundColor: "white",
          border: "1px solid rgba(0,0,0,0.05)",
          maxWidth: "100%",
        }}
        className={`shadow-1 print:shadow-none ${
          expand
            ? "fixed top-12 left-5 bottom-0 right-5 rounded-t z-30 mb-0"
            : "relative rounded"
        }`}
        props={props}
      >
        <div ref={ref} className={`rounded relative z-10 ${boxClass}`}>
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
