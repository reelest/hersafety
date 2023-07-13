import Template from "./Template";

export default function Spacer(props) {
  return <Template as="div" className="flex-grow" props={props} />;
}
