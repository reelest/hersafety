import { useEffect, useMemo, useRef, useState } from "react";
import range from "./range";
import hasProp from "./hasProp";
import delay from "./delay";
import { unsortedUniq } from "./uniq";
/**
 *
 * @param {import("react").Ref<HTMLFormElement> & {current: HTMLFormElement}} ref
 */
export default function useBrowserFormValidation(ref, data, validationRules) {
  useEffect(() => {
      if(!ref.current || !ref.current.elements) return console.warn("Unknown element type "+ref.current?.tagName);
    range(ref.current.elements.length).forEach((e) =>
      ref.current.elements.item(e).setCustomValidity("")
    );
    validationRules.forEach((e) => e.validate(ref.current, data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, ref, ...validationRules]);
  const getField = (name) => {
    if (ref?.current) {
      if (!ref.current.elements[name]){
        (async () => {
          await delay(1);
          if (!ref.current.elements[name])
            console.warn("Unknown field " + name);
        })();
        return;
      } else if(! ref.current.elements[name].validity){
      console.warn("Field "+name+" has no validity");
      }else

      return ref.current.elements[name];
    }
  };
  return {
    isFieldInError: (name) =>
      getField(name) ? !getField(name).validity.valid : false,
    getErrorMessages: () =>
      ref?.current
        ? range(ref.current.elements.length)
            .map((e) => ref.current.elements.item(e).validationMessage)
            .filter(unsortedUniq)
            .join("\n")
        : "No form reference provided",
    getErrorsInField: (name) => getField(name)?.validationMessage ?? "",
    isFormValid: true, //depend on form to provide validity
  };
}

export function formValidator(field, validate) {
  return {
    validate: (form, data) => {
      let e;
      if (hasProp(form.elements, field) && (e = validate(data, field))) {
        form.elements[field].setCustomValidity(e);
      }
    },
    with: (field, ...args) =>
      formValidator(field, (...args2) => validate(...args2, ...args)),
  };
}
