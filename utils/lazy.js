export default function lazy(func) {
  let notInit = true;
  let result = null;
  return function () {
    if (notInit) {
      notInit = false;
      result = func();
    }
    return result;
  };
}
