import { Button, IconButton, Modal, Paper, Typography } from "@mui/material";
import ModelFormField from "./ModelFormField";
import Form, { FormField, FormSubmit } from "./Form";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Add, ArrowDown, ArrowUp, CloseCircle, Edit } from "iconsax-react";
import deepEqual from "deep-equal";
import { getDefaultValue } from "@/models/lib/model_type_info";
import useLogger from "@/utils/useLogger";
import ModelForm from "./ModelForm";

/**
 *
 * @param {Object} props
 * @param {import("@/models/lib/model_type_info").ModelPropInfo} props.meta
 * @returns
 */
function ArrayField({ name, id, meta, value, onChange, ...props }) {
  if (!value) value = [];
  const _id = useCallback((e) => name + "[" + e + "]", [name]);
  const _new = useMemo(() => _id(value.length), [_id, value.length]);
  const [edit, setEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const setValue = (_value) =>
    !deepEqual(_value, value) &&
    onChange({
      target: {
        value: _value,
      },
    });

  useEffect(() => {
    if (edit && value[edit.index] !== edit.value) {
      setEdit(null);
    }
  }, [value, edit]);

  useEffect(() => {
    if (edit) setShowForm(true);
  }, [edit]);

  useEffect(() => {
    if (!showForm) setEdit(null);
  }, [showForm]);
  const initialValue = useMemo(
    () =>
      value.reduce((a, e, i) => ((a[_id(i)] = e), a), {
        [_new]: getDefaultValue(meta.arrayType),
      }),
    [value, meta, _id, _new]
  );
  const displayMeta = useMemo(
    () => value.reduce((a, e, i) => ((a[_id(i)] = meta.arrayType), a), {}),
    [value, meta, _id]
  );
  console.log({ initialValue });
  return (
    <>
      {/* For stop browser form validation errors*/}
      <input name={name} id={id} type="hidden" />

      <div className="flex items-center justify-between w-full">
        <Typography variant="h6">{meta.label}</Typography>
        <Button onClick={() => setShowForm(true)}>
          Add New <Add />
        </Button>
      </div>
      <ModelForm initialValue={initialValue} meta={displayMeta}>
        {value.map((e, i) => (
          <ModelFormArrayItem
            key={e}
            index={i}
            value={value}
            setValue={setValue}
            getId={_id}
            meta={meta.arrayType}
            setEdit={setEdit}
          />
        ))}
      </ModelForm>
      <Modal
        open={showForm}
        onClose={(_, reason) =>
          reason === "backdropClick" || setShowForm(false)
        }
      >
        {/* Modal must have only one child */}
        <Paper className="w-[32rem] mx-auto max-w-[90%] pt-4 px-8 max-sm:px-4 overflow-auto pb-12 flex flex-col">
          <div className="text-right -mx-3.5 max-sm:-mx-0.5">
            <IconButton onClick={() => setShowForm(false)}>
              <CloseCircle />
            </IconButton>
          </div>
          <Typography variant="h5" sx={{ mb: 4 }}>
            {edit ? "Replace Item" : "Add new item"}
          </Typography>
          <Form
            {...props}
            className="w-full"
            initialValue={initialValue}
            onSubmit={(data) => {
              setValue([
                ...value.slice(0, edit ? edit.index : value.length),
                data[edit ? _id(edit.index) : _new],
                ...value.slice(edit ? edit.index + 1 : value.length),
              ]);
              setShowForm(false);
            }}
            onChange={(data) => {
              console.log({ data });
            }}
          >
            <ModelFormField
              name={edit ? _id(edit.index) : _new}
              meta={meta.arrayType}
            />
            <FormSubmit
              variant="contained"
              sx={{ mt: 4, ml: "auto", display: "block" }}
            >
              {edit ? "Update" : "Save"}
            </FormSubmit>
          </Form>
        </Paper>
      </Modal>
    </>
  );
}

function ModelFormArrayItem({ meta, index, value, setValue, getId, setEdit }) {
  const e = value[index];
  const i = index;
  const move = (e, from, to) => {
    if (value[from] === e && value[to] !== undefined) {
      value = value.slice();
      const temp = value[from];
      value[from] = value[to];
      value[to] = temp;
      setValue(value);
    }
  };
  const remove = useCallback(
    (e, from) => {
      if (value[from] === e) {
        setValue([...value.slice(0, from), ...value.slice(from + 1)]);
      }
    },
    [value, setValue]
  );
  const _value = value[index];
  useEffect(() => {
    if (meta.arrayType === "ref" && !_value) {
      remove(_value, index);
    }
  }, [meta, _value, index, remove]);
  return (
    <div className="flex flex-wrap items-center" key={e}>
      <Typography sx={{ mr: 4 }}>{i + 1}.</Typography>
      <ModelFormField name={getId(i)} meta={meta} disabled />
      <div className="flex">
        <IconButton onClick={() => move(e, i, i - 1)} disabled={i === 0}>
          <ArrowUp />
        </IconButton>
        <IconButton
          onClick={() => move(e, i, i + 1)}
          disabled={i === value.length - 1}
        >
          <ArrowDown />
        </IconButton>
        <IconButton onClick={() => setEdit({ value: e, index: i })}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => remove(e, i)}>
          <CloseCircle />
        </IconButton>
      </div>
    </div>
  );
}

export default function ModelFormArrayField({ name, ...props }) {
  return <FormField name={name} as={ArrayField} {...props} />;
}
