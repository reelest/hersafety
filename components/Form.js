import Template from "./Template";
import { createContext, useContext, useRef, useState } from "react";
import useFormHandler from "@/utils/useFormHandler";
// import ImagePicker from "./ImagePicker";
import useValidation from "@/utils/useBrowserFormValidation";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import ThemedButton from "@mui/material/Button";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
} from "@mui/material";
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
  const ref = useRef();
  const { isFieldInError, getErrorMessages, isFormValid, getErrorsInField } =
    useValidation(ref);
  return (
    <Template as="form" {...handler.form()} props={props} templateRef={ref}>
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
export function FormField({ name, type, label, ...props }) {
  const { isFieldInError, handler, showErrors } = useContext(FormContext);
  const control =
    type === "checkbox" ? Checkbox : type === "switch" ? Switch : null;
  return (
    <Template
      as={control ? FormFieldWrapper : TextField}
      control={control}
      label={label}
      autoFocus
      error={isFieldInError(name) && showErrors}
      variant="standard"
      fullWidth
      // InputLabelProps={{ shrink: true }}
      margin="dense"
      props={props}
      {...(control
        ? handler.checkbox(name)
        : type === "radio"
        ? {}
        : handler.textInput(name, type))}
    />
  );
}

function FormFieldWrapper({
  control: Component,
  id,
  name,
  value,
  onChange,
  label,
  helperText,
  props,
  ...props2
}) {
  return (
    <FormControl {...{ ...props2, ...props }}>
      <FormControlLabel
        control={<Component {...{ id, name, checked: value, onChange }} />}
        label={label}
      />
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
}

export function FormRadio({
  name,
  values = [],
  labels = values,
  label,
  helperText,
  ...props
}) {
  const { handler } = useContext(FormContext);
  return (
    <FormField as={FormControl} type="radio" {...props}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup {...handler.radio(name)}>
        {values.map((e, i) => (
          <FormControlLabel
            key={e}
            control={<Radio value={e} />}
            label={labels[i] ?? e}
          />
        ))}
      </RadioGroup>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormField>
  );
}

export function FormImage(props) {
  return <FormField type="image" {...props} />;
}

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
    <p className="font-20 text-red-500">
      {handler.error ? handler.error.message : null}
      {getErrorMessages().split("\n").slice(0, lines).join("\n")}
    </p>
  ) : null;
}

export const REQUIRED = { required: true, minlength: 1 };
export const REQUIRED_NUMBER = { required: true, numbers: true };
export const REQUIRED_PHONE = { required: true, phone: true };
export const REQUIRED_EMAIL = { required: true, email: true };
export const CONFIRM_PASSWORD = { required: true, equalField: "password" };
export const REQUIRED_PASSWORD = { required: true, minlength: 8 };
