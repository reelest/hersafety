import Template from "./Template";
import { createContext, useContext, useState } from "react";
import useFormHandler from "@/utils/useFormHandler";
// import ImagePicker from "./ImagePicker";
import {
  defaultMessages,
  defaultRules,
  useValidation,
} from "react-simple-form-validator";
import TextInput from "./TextInput";
import ThemedButton from "./ThemedButton";
import Checkbox from "./Checkbox";
// import { useCSRFToken } from "@/logic/api_get";

/**
 * @typedef {{
 *  handler: {textInput: Function},
 * }} FormParams
 */
/**
 * @type {React.Context<FormParams>}
 */
const FormContext = createContext();

export default function Form({
  children,
  validationRules = {},
  initialValue = {},
  onSubmit = null,
  ...props
}) {
  const handler = useFormHandler(initialValue, async function handle(fd, e) {
    if (!showErrors) setShowErrors(true);
    if (isFormValid) {
      if (onSubmit) {
        try {
          e.preventDefault();
          setLoading(true);
          await onSubmit(fd);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
      //Allow native submit
    } else e.preventDefault();
  });

  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { isFieldInError, getErrorMessages, isFormValid, getErrorsInField } =
    useValidation({
      fieldsRules: validationRules,
      locale: "en",
      rules: {
        phone: (_, val) => /^\+?\d+$/.test(val),
        equalField: (field, val) => val === handler.data[field],
        ...defaultRules,
      },
      messages: {
        ...defaultMessages,
        en: {
          ...defaultMessages.en,
          phone: "Invalid phone number",
          equalField: defaultMessages.en.equalPassword,
        },
      },
      state: handler.data,
    });
  return (
    <Template as="form" {...handler.form()} props={props}>
      <FormContext.Provider
        value={{
          handler,
          data: handler.data,
          isFieldInError,
          showErrors,
          getErrorMessages,
          getErrorsInField,
          isLoading,
        }}
      >
        {children}
      </FormContext.Provider>
    </Template>
  );
}

/**
 *
 * @param {import("react-native-paper").TextInputProps} param0
 * @returns
 */
export function FormField({ name, type, ...props }) {
  const { isFieldInError, handler, showErrors } = useContext(FormContext);
  return (
    <Template
      as={type === "checkbox" ? Checkbox : TextInput}
      type={type}
      props={props}
      {...(type === "checkbox"
        ? handler.checkbox(name)
        : handler.textInput(name, type))}
      outlineColor={
        showErrors && isFieldInError?.(name) ? "outline-secondary" : null
      }
      activeOutlineColor={
        showErrors && isFieldInError?.(name)
          ? "focus-visible:outline-secondary"
          : "focus-visible:outline-primaryLight"
      }
    />
  );
}

// export function FormImage({ name, ...props }) {
//   const { handler } = useContext(FormContext);

//   return (
//     <Template
//       as={ImagePicker}
//       image={handler.data[name]}
//       setImage={(e) => handler.set(name, e)}
//       props={props}
//     />
//   );
// }

export function FormSubmit({ name, disabled, ...props }) {
  const { handler, isLoading } = useContext(FormContext);
  return (
    <ThemedButton
      {...handler.submit(name)}
      {...props}
      disabled={disabled || isLoading}
    />
  );
}

export function FormErrors({ lines = 2 }) {
  const { showErrors, getErrorMessages, handler } = useContext(FormContext);
  return showErrors ? (
    <p className="font-20 text-secondary">
      {handler.error ? handler.error.message : null}
      {getErrorMessages().split("\n").slice(0, lines).join("\n")}
    </p>
  ) : null;
}

export const REQUIRED = { required: true, minlength: 1 };
export const REQUIRED_NUMBER = { required: true, numbers: true };
export const REQUIRED_PHONE = { required: true, phone: true };
export const REQUIRED_EMAIL = { required: true, email: true };
export const REQUIRED_PASSWORD = { required: true, minlength: 8 };
