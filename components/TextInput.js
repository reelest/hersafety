import Template from "./Template";

export default function TextInput({
  variant = "gray",
  outlineColor = "outline-primaryLight",
  activeOutlineColor = "focus-visible:outline-primaryLight",
  width = "w-full",
  ...props
}) {
  return (
    <Template
      as="input"
      className={
        variant === "gray"
          ? `px-5 py-4 bg-transparentGray placeholder:text-input-placeholder font-20 rounded-xl ${width} ${outlineColor} ${activeOutlineColor}`
          : variant === "search"
          ? "px-5 py-4 bg-white shadow-1 border-0 w-full rounded-full outline-none"
          : ""
      }
      props={props}
    />
  );
}

export function TextInputDecor({ startIcon, endIcon, children, ...props }) {
  return (
    <Template className="relative" {...{ props }}>
      <div className="absolute top-1/2 -translate-y-1/2">{startIcon}</div>
      {children}
      <div className="absolute top-1/2 -translate-y-1/2 right-0">{endIcon}</div>
    </Template>
  );
}
