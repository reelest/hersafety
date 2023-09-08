import { None, noop } from "@/utils/none";
import {
  Box,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Form, {
  FormErrors,
  FormField,
  FormImage,
  FormSelect,
  FormSubmit,
} from "./Form";
import { useMemo, useState } from "react";
import Spacer from "./Spacer";
import { uploadFile } from "@/logic/storage";
import { timeFormat } from "d3";
import ModelFormSelect from "./ModelFormSelect";
const FORM_SECTION = "!modelform-section";

/* Make this component simple enough for most use cases, advanced cases should just use ModelFormField */
export default function ModelForm({
  model,
  item,
  submitText,
  onSubmit = noop,
  noSave = false,
  ...props
}) {
  const sections = { DEFAULT: [] };
  Object.keys(model.Meta).forEach((e) => {
    let section = sections.DEFAULT;
    const sectionName = model.Meta[e][FORM_SECTION];
    if (sectionName) {
      section = sections[sectionName] || (sections[sectionName] = []);
    }
    if (e[0] === "!") return;
    section.push(e);
  });
  return (
    <Form
      key={item?.id?.()}
      onSubmit={async (data) => {
        data = await prepareForUpload(data, model.Meta);
        console.log({ data });
        if (!noSave) await item.set(data);
        await onSubmit(data);
      }}
      initialValue={item ? prepareForRender(item.data(), model.Meta) : None}
      {...props}
    >
      <div className="flex flex-wrap">
        <Typography
          variant="body2"
          color="text.disabled"
          className="text-right w-full"
        >
          {item ? item.id() : "Loading..."}
        </Typography>
        <FormErrors />
        {Object.keys(sections)
          .map((e) => [
            e === "DEFAULT" ? null : (
              <Typography key={"!header-" + e} variant="h5" sx={{ mt: 15 }}>
                {e}
              </Typography>
            ),
            sections[e].map((e) =>
              createFormField(e, model.Meta[e], { disabled: !item })
            ),
            <div key={"!spacer" + e} className="w-full" />,
          ])
          .flat()}
      </div>
      <Spacer />
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

export function ModelFormField({ key: e, model, item }) {
  return createFormField(e, model.Meta[e], { disabled: !item });
}
/** @type {Array<import("@/models/lib/model_type_info").StringType>} */
const INPUT_TYPES = ["email", "password", "tel", "url"];

/** @param {import("@/models/lib/model_type_info").ModelPropInfo} meta*/
function collectInputProps(meta) {
  return Object.keys(meta).reduce((acc, _key) => {
    /** @type {keyof import("@/models/lib/model_type_info").ModelPropInfo}*/
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
 * @param {import("@/models/lib/model_type_info").ModelPropInfo} meta
 */
function createFormField(name, meta, { disabled } = {}) {
  const commonProps = {
    name: name,
    key: name,
    label: meta.label,
    disabled: disabled || meta.disabled,
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
          sx={{ minWidth: "10em", flexGrow: 1, mx: 1, maxWidth: "15em" }}
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
    case "image":
      return (
        <FormImage
          {...commonProps}
          sx={{ minWidth: "15em", mx: 1, maxWidth: "30em" }}
        />
      );
    case "ref":
      return (
        <ModelFormSelect
          {...commonProps}
          {...collectInputProps(meta)}
          meta={meta}
        />
      );
    default:
      throw new Error("Unhandled Input type " + meta.type);
  }
}

/**
 *
 * @param {any} data
 * @param {import("@/models/lib/model_type_info").ModelTypeInfo} meta
 */
const prepareForUpload = async (data, meta) => {
  data = Object.assign({}, data);
  for (let key in meta) {
    if (Object.hasOwnProperty.call(data, key)) {
      switch (meta[key].type) {
        case "datetime":
        case "date":
        case "time":
          data[key] = data[key] ? Date.parse(data[key]) : -1;
          break;
        case "file":
        case "image":
          if (data[key] && typeof data[key] !== "string") {
            data[key] = await uploadFile(data[key]);
          }
      }
    }
  }
  return data;
};

const DATE = timeFormat("%d/%m/%Y");
const DATE_TIME = timeFormat("%d/%m/%YT%H:%M");
const TIME = timeFormat("%H:%M");
/**
 *
 * @param {any} data
 * @param {import("@/models/lib/model_type_info").ModelTypeInfo} meta
 */
const prepareForRender = (data, meta) => {
  data = Object.assign({}, data);
  for (let key in meta) {
    if (Object.hasOwnProperty.call(data, key) && data[key]) {
      switch (meta[key].type) {
        case "datetime":
          data[key] = DATE_TIME(new Date(data[key]));
          break;
        case "date":
          data[key] = DATE(new Date(data[key]));
          break;
        case "time":
          data[key] = TIME(new Date(data[key]));
          break;
      }
    }
  }
  return data;
};
