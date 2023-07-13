import { useNavigate } from "react-router-dom";

const useLinkHandler = function () {
  const history = useNavigate();
  return (link) => () => history.push(link);
};
export default useLinkHandler;
