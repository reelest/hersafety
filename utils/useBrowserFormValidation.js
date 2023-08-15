import range from "./range";
/**
 *
 * @param {import("react").Ref<HTMLFormElement> & {current: HTMLFormElement}} ref
 */
export default function useBrowserFormValidation(ref) {
  return {
    isFieldInError: (name) => {
      return ref?.current ? ref.current.elements[name].validity.valid : false;
    },
    getErrorMessages: () => {
      return ref?.current
        ? range(ref.current.elements.length).map(
            (e) => ref.current.elements.item(e).validity.validationMessage
          )
        : "No form reference provided";
    },
    getErrorsInField: (name) => {
      return ref?.current
        ? ref.current.elements[name].validity.validationMessage
        : "";
    },
    isFormValid: () => {
      return ref?.current ? ref.current.validity.valid : false;
    },
  };
}
