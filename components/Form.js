import Template from "./Template";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import useFormHandler from "@/utils/useFormHandler";
// import ImagePicker from "./ImagePicker";
import useValidation, { formValidator } from "@/utils/useBrowserFormValidation";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import ThemedButton from "@mui/material/Button";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import pick from "@/utils/pick";
import Image from "next/image";
import { Trash } from "iconsax-react";
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
  validationRules = [],
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
    useValidation(ref, handler.data, validationRules);
  return (
    <Template
      as="form"
      {...handler.form()}
      props={props}
      onInvalid={() => {
        setShowErrors(true);
      }}
      templateRef={ref}
    >
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
export function FormField({
  name,
  type,
  label,
  maxLength,
  minLength,
  pattern,
  min,
  max,
  ...props
}) {
  const { isFieldInError, handler, showErrors, getErrorsInField } =
    useContext(FormContext);
  const control =
    type === "checkbox" ? Checkbox : type === "switch" ? Switch : null;
  return (
    <Template
      as={control ? FormFieldWrapper : TextField}
      control={control}
      className={
        !handler.data[name] &&
        (type === "date" || type === "datetime-local" || type === "time")
          ? "empty-date-input" //used in globals.css
          : null
      }
      label={label}
      error={isFieldInError(name) && showErrors}
      helperText={
        isFieldInError(name) && showErrors ? getErrorsInField(name) : undefined
      }
      variant="standard"
      margin="dense"
      fullWidth
      props={props}
      {...(control
        ? handler.checkbox(name)
        : type === "radio"
        ? {}
        : handler.textInput(name, type))}
      inputProps={{ maxLength, minLength, pattern, min, max }}
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
    <FormField as={FormControl} name={name} type="radio" {...props}>
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

export function FormSelect({ values = [], labels = values, ...props }) {
  const native = values.length > 100;
  const Option = native ? "option" : MenuItem;
  return (
    <FormField
      select
      {...props}
      type="select"
      SelectProps={{
        native,
      }}
      InputLabelProps={
        native
          ? {
              shrink: true,
            }
          : null
      }
    >
      {values.map((e, i) => (
        <Option key={labels[i] ?? e} value={e}>
          {labels[i] ?? e}
        </Option>
      ))}
    </FormField>
  );
}

export function FormImage(props) {
  return <FormField as={ImageField} type="file" {...props} />;
}

export function ImageField({
  id,
  value,
  label,
  helperText,
  onChange,
  sx,
  style,
  className,
  ...props
}) {
  const [src, setSrc] = useState(false);
  useEffect(() => {
    if (!value) {
      return;
    } else if (typeof value === "string") {
      setSrc(value);
      return;
    } else {
      const url = URL.createObjectURL(value);
      setSrc(url);
      return () => {
        setSrc(null);
        URL.revokeObjectURL(url);
      };
    }
  }, [value]);
  const expanded = !!value;
  return (
    <Template
      as={Box}
      className="flex flex-col relative items-center min-w-[5rem] rounded"
      sx={{
        m: 1,
        mt: expanded ? 2 : 5.5,
      }}
      props={{ sx, style, className }}
    >
      {expanded ? (
        <div className="absolute top-5 p-0 right-0 opacity-50 hover:opacity-100">
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              onChange({ target: { value: null } });
            }}
          >
            <Trash />
          </Button>
        </div>
      ) : null}
      <InputLabel
        className={"self-start" + (expanded ? "" : " mb-1")}
        shrink={expanded}
      >
        {label}
      </InputLabel>
      <Box
        as="img"
        src={src}
        alt={"Supplied image for " + props.name}
        className="rounded-t"
        sx={{
          backgroundColor: "gray.light",
          color: "primary.dark",
          flexGrow: 1,
          display: expanded ? "" : "none",
          width: "auto",
          minHeight: "10rem",
          maxWidth: "20rem",
        }}
      />
      <Button
        as="label"
        variant="contained"
        for={id}
        sx={{
          width: "100%",
          borderTopLeftRadius: expanded ? 0 : undefined,
          borderTopRightRadius: expanded ? 0 : undefined,
          textAlign: "center",
        }}
      >
        {value ? "Replace Image" : "Pick Image"}
      </Button>
      <Template
        as="input"
        type="file"
        className="block w-0 h-0 max-h-0 min-h-0 opacity-0"
        id={id}
        accept="image/*"
        onChange={(e) => {
          onChange({ target: { value: e.target.files[0] } });
        }}
        props={props}
      />
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </Template>
  );
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
    <Typography paragraph className="text-error">
      {handler.error ? handler.error.message : null}
      {getErrorMessages().split("\n").slice(0, lines).join("\n")}
    </Typography>
  ) : null;
}

export const CONFIRM_PASSWORD = formValidator(
  "confirmpassword",
  (data, field, match = "password") => {
    return data[field] === data[match] && "Passwords do not match";
  }
);
