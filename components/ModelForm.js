import { None, noop } from "@/utils/none";
import {
  Box,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Form, { FormField, FormSelect, FormSubmit } from "./Form";
import { useState } from "react";
const FORM_SECTION = "!modelform-section";
export default function ModelForm({
  model,
  item,
  submitText,
  onSubmit = noop,
  ...props
}) {
  const sections = { DEFAULT: [] };
  Object.keys(model.Meta).forEach((e) => {
    let section = sections.DEFAULT;
    if (model.Meta[e][FORM_SECTION]) {
      section =
        sections[model.Meta[e][FORM_SECTION]] ||
        (sections[model.Meta[e][FORM_SECTION]] = []);
    }
    if (e[0] === "!") return;
    section.push(e);
  });
  return (
    <Form
      key={item?.id?.()}
      onSubmit={async (data) => {
        await item.set(data);
        await onSubmit();
      }}
      initialValue={item ? item.data() : None}
      {...props}
      className="flex flex-wrap"
    >
      <Typography
        variant="body2"
        color="text.disabled"
        className="text-right w-full"
      >
        {item ? item.id() : "Loading..."}
      </Typography>
      {Object.keys(sections)
        .map((e) => [
          e === "DEFAULT" ? null : (
            <Typography key={"!modelform-header-" + e} variant="h5">
              {e}
            </Typography>
          ),
          sections[e].map((e) =>
            createFormField(e, model.Meta[e], { disabled: !item })
          ),
        ])
        .flat()}
      <div className="w-full"></div>
      <FormSubmit
        sx={{ mt: 12, display: "block", ml: "auto" }}
        variant="contained"
        size="large"
        disabled={!item}
      >
        {submitText ?? (item?.isLocalOnly?.() ? "Save" : "Update")}
      </FormSubmit>
    </Form>
  );
}
/** @type {Array<import("@/models/model_type_info").StringType>} */
const INPUT_TYPES = ["email", "password", "tel", "url"];

/** @param {import("@/models/model_type_info").ModelPropInfo} meta*/
function collectInputProps(meta) {
  return Object.keys(meta).reduce((acc, _key) => {
    /** @type {keyof import("@/models/model_type_info").ModelPropInfo}*/
    let key = _key;
    let value = meta[key];
    if (value === undefined) return acc;
    switch (key) {
      // case "label": Handled by commonProps
      // case "required":
      case "minLength":
      case "maxLength":
        break;
      case "pattern":
        value = value.raw;
        break;
      case "minValue":
        key = "min";
        break;
      case "maxValue":
        key = "max";
        break;
      case "type":
        value =
          value === "string"
            ? INPUT_TYPES.includes(meta.stringType)
              ? meta.stringType
              : "text"
            : value === "datetime"
            ? "datetime-local"
            : value === "number"
            ? "text"
            : value;
        break;
      default:
        return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
}

const PATTERNS = {
  date: {
    re: "(\\d{4})-([1-9]|[01][0-2])-([1-9]|[0-3][0-9])",
    desc: "YYYY-MM-DD",
  },
  time: {
    re: "([1-9]|[0-2][0-2]):([1-9]|[1-6][0-9])",
    desc: "HH:MM",
  },
  datetime: {
    re: "(\\d{4})-([1-9]|[01][0-2])-([1-9]|[0-3][0-9])[T ]([1-9]|[0-2][0-2]):([1-9]|[1-6][0-9])",
    desc: "YYYY-MM-DD HH:MM",
  },
};

/**
 *
 * @param {string} name
 * @param {import("@/models/model_type_info").ModelPropInfo} meta
 */
function createFormField(name, meta, { disabled } = {}) {
  const commonProps = {
    name: name,
    key: name,
    label: meta.label,
    disabled,
    fullWidth: false,
    required: meta.required,
    sx: { minWidth: "15em", flexGrow: 1, mx: 1 },
  };
  switch (meta.type) {
    case "hidden":
      return null;
    case "string":
    case "number":
      if (meta.options) {
        return (
          <FormSelect
            {...commonProps}
            values={meta.options.map((e) => e.value)}
            labels={meta.options.map((e) => e.label)}
          />
        );
      }
      return (
        <FormField
          {...commonProps}
          fullWidth
          multiline={meta.stringType === "longtext"}
          {...(meta.type === "number"
            ? { inputMode: "numeric", pattern: "[0-9]*" }
            : None)}
          {...collectInputProps(meta)}
        />
      );
    case "boolean":
      return <FormField {...commonProps} type="checkbox" />;
    case "date":
    case "datetime":
    case "time":
      return (
        <FormField
          {...commonProps}
          pattern={PATTERNS[meta.type].re}
          {...collectInputProps(meta)}
          onInvalid={(e) => {
            if (e.target.validity.patternMismatch)
              e.target.setCustomValidity(
                `Value must match pattern ${PATTERNS[meta.type].desc}`
              );
          }}
        />
      );
    default:
      throw new Error("Unhandled Input type " + meta.type);
  }
}
