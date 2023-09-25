import { None } from "@/utils/none";
import Template from "./Template";

const variants = {
  text: "font-20 active:text-primary hover:text-primaryLight ",
  large:
    "px-10 py-5 rounded-2xl font-24b active:bg-primaryDark disabled:bg-lightGray hover:outline disabled:hover:outline-none outline-accent1",
  classic:
    "px-6 py-2 rounded-2xl font-20 active:bg-primary disabled:opacity-50 hover:outline disabled:hover:outline-none outline-accent1",
  small:
    "px-6 py-1 rounded-lg font-24b active:bg-primary disabled:opacity-50 hover:outline disabled:hover:outline-none outline-accent1",
};

const mergeableEvents = ["onClick"];
export default function ThemedButton({
  variant,
  bg = variant === "large"
    ? "bg-primary"
    : variant === "text"
    ? "bg-transparent"
    : "bg-primaryLight",
  color = variant === "text" ? "text-placeholder" : "text-white",
  caret = false,
  children,
  value,
  noSubmit,
  ...props
}) {
  return (
    <Template
      as="button"
      className={variants[variant] + " " + bg + " " + color}
      mergeableEvents={mergeableEvents}
      value={caret && !children && value ? value + "\xa0\xa0>" : value}
      {...(noSubmit ? { onClick: preventDefault } : None)}
      props={{
        children:
          caret && children
            ? [].concat(children).concat(["\xa0\xa0>"])
            : children,
        ...props,
      }}
    />
  );
}

const preventDefault = (e) => e.preventDefault();
