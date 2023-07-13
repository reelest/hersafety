export default function mergeProps(props1, props2, eventNames) {
  return {
    ...props1,
    ...props2,
    ...Object.fromEntries(
      eventNames
        .map(
          (name) =>
            props1[name] &&
            props2[name] && [
              name,
              (...args) => (props1[name](...args), props2[name](...args)),
            ]
        )
        .filter(Boolean)
    ),
  };
}
