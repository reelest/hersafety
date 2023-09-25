import Template from "./Template";

export default function LoaderAnimation({ small, light, ...props }) {
  const bg = light ? "fill-primaryLight" : "fill-primary";
  return (
    <Template
      as="svg"
      viewBox="0 0 30 30"
      className={small ? "w-10 block mx-auto my-4" : ""}
      xmlns="http://www.w3.org/2000/svg"
      props={props}
    >
      <rect rx="4" className={bg} x="0" width="10" height="40">
        <animate
          attributeName="y"
          values="0;30;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
      <rect rx="4" className="fill-secondary" x="10" width="10" height="40">
        <animate
          attributeName="y"
          begin="-0.667s"
          values="0;30;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
      <rect rx="4" className={bg} x="20" width="10" height="40">
        <animate
          attributeName="y"
          values="0;30;0"
          begin="-1.333s"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        rx="50"
        className={bg}
        width="100"
        height="10"
        x="-35"
        y="28"
        opacity={0.2}
      ></rect>
    </Template>
  );
}
