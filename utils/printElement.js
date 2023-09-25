import delay from "./delay";
import styles from "./print_element.module.css";

const PRESERVE_PARENT = styles["print-parent"];
const PRESERVE_TARGET = styles["print-target"];
const PRESERVE_ALWAYS = styles["print-preserve"];
export const ROOT_CLASS = styles["printing"];
const get = (e) => document.getElementsByClassName(e);
const show = (elem) => {
  while (elem) {
    elem.classList.add(PRESERVE_PARENT);
    elem = elem.parentElement;
  }
};

let id_ = 0;
const clearClasses = async () => {
  const _id = id_++;
  await delay(5000);
  if (_id === id_) {
    let els = get(PRESERVE_TARGET);
    for (let i = els.length - 1; i >= 0; i--) {
      els.item(i).classList.remove(PRESERVE_TARGET);
    }
    els = get(PRESERVE_PARENT);
    for (let i = els.length - 1; i >= 0; i--) {
      els.item(i).classList.remove(PRESERVE_PARENT);
    }
    document.documentElement.classList.remove(ROOT_CLASS);
  }
};

export default function printElement(elem) {
  try {
    elem.classList.add(PRESERVE_TARGET);
    show(elem);
    const els = get(PRESERVE_ALWAYS);
    for (let i = els.length - 1; i >= 0; i--) {
      show(els.item(i));
    }
    document.documentElement.classList.add(ROOT_CLASS);
    window.print();
    //The first printing can take time so we delay clearing the classes.
  } finally {
    clearClasses();
  }
}
