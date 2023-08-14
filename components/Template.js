import { Empty, None } from "@/utils/none";
import { createElement } from "react";
import mergeProps from "@/utils/mergeProps";

export default function Template({
  as = "div",
  children,
  className = "",
  style = None,
  sx = null,
  templateAs,
  props: {
    className: className2 = "",
    style: styles2 = null,
    sx: sx2 = None,
    children: children2,
    templateAs: templateAs2,
    as: as2,
    ...props2
  },
  mergeableEvents = Empty,
  ...props
}) {
  return createElement(
    as2 || as,
    {
      style: style ? (styles2 ? { ...style, ...styles2 } : style) : styles2,
      sx: sx ? (sx2 ? { ...sx, ...sx2 } : sx) : sx2,
      as: templateAs2 || templateAs,
      className: `${className} ${className2}`,
      ...mergeProps(props, props2, mergeableEvents),
    },
    children && children2
      ? [].concat(children).concat(children2)
      : children || children2
  );
}
