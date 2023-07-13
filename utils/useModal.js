import { createElement, useState } from "react";

/**
 *
 * @param {import("react").ReactComponentElement} component
 * @returns
 */
export default function useModal(component) {
  const [isOpen, setOpen] = useState(false);
  return [
    (val) => {
      setOpen(typeof val === "boolean" ? val : !isOpen);
    },
    isOpen
      ? createElement(component.type, {
          open: isOpen,
          onClose: () => setOpen(false),
          ...component.props,
        })
      : null,
  ];
}
