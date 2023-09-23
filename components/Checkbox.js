import Template from "./Template";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
export default function Checkbox({
  // eslint-disable-next-line no-unused-vars
  activeOutlineColor,
  // eslint-disable-next-line no-unused-vars
  outlineColor,
  className,
  style,
  ...props
}) {
  return (
    <Template
      className="relative w-4 h-4 inline-block"
      props={{ style, className }}
    >
      <Template
        as="input"
        type="checkbox"
        className="peer absolute inset-0 w-full h-full rounded-sm appearance-none checked:bg-primaryLight outline-1 bg-transparentGray"
        props={props}
      />
      <CheckIcon className="absolute inset-0 pointer-events-none text-white peer-checked:visible invisible" />
    </Template>
  );
}
