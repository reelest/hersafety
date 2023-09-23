import Template from "./Template";

export default function Spacer(props) {
  return <Template as="span" className="flex-grow" props={props} />;
}
