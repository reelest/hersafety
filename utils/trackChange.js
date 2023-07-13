export default function trackChange(setValue) {
  return (ev) => {
    setValue(ev.target.value || "");
  };
}
