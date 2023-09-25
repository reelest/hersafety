import { Button, IconButton, Modal, Paper, Typography } from "@mui/material";
import ModelFormField from "./ModelFormField";
import Form, { FormField, FormSubmit } from "./Form";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Add, ArrowUp, CloseCircle } from "iconsax-react";
import deepEqual from "deep-equal";
import { getDefaultValue } from "@/models/lib/model_type_info";

/**
 *
 * @param {Object} props
 * @param {import("@/models/lib/model_type_info").ModelPropInfo} props.meta
 * @returns
 */
function ArrayField({ name, id, meta, value, onChange, ...props }) {
  if (!value) value = [];
  const _id = useCallback((e) => name + "[" + e + "]", [name]);
  const _new = useMemo(() => _id(""), [_id]);
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
        [_new]: getDefaultValue(meta),
      }),
    [value, meta, _id, _new]
  );

  const _newValue = useRef(initialValue[_new]);

  const move = (e, from, to) => {
    if (value[from] === e && value[to] !== undefined) {
      value = value.slice();
      const temp = value[from];
      value[from] = value[to];
      value[to] = temp;
      setValue(value);
    }
  };

  const remove = (e, from) => {
    if (value[from] === e) {
      setValue([...value.slice(0, from), ...value.slice(from + 1)]);
    }
  };

  return (
    <>
      {/* For stop browser form validation errors*/}
      <input name={name} id={id} type="hidden" />

      <div className="flex items-center justify-between w-full">
        <Typography variant="h6">{meta.label}</Typography>
        {/* <Button onClick={() => setShowForm(true)}>
          Add New <Add />
        </Button> */}
      </div>
      <Form>
        {value.map((e, i) => (
          <div className="flex flex-wrap" key={e}>
            <Typography sx={{ mr: 4 }}>{i + 1}</Typography>
            <ModelFormField name={_id(i)} meta={meta.arrayType} disabled />
            <div className="flex">
              <IconButton onClick={() => move(e, i, i - 1)} disabled={i === 0}>
                <ArrowUp />
              </IconButton>
              <IconButton
                onClick={() => move(e, i, i + 1)}
                disabled={i === value.length - 1}
              >
                <ArrowUp />
              </IconButton>
              <IconButton onClick={() => setEdit({ value: e, index: i })}>
                <CloseCircle />
              </IconButton>
              <IconButton onClick={() => remove(e, i)}>
                <CloseCircle />
              </IconButton>
            </div>
          </div>
        ))}
      </Form>
      <Modal
        open={showForm}
        onClose={(_, reason) =>
          reason === "backdropClick" || setShowForm(false)
        }
      >
        {/* Modal must have only one child */}
        <Paper className="w-96 mx-auto max-w-2xl pt-4 px-8 max-sm:px-4 overflow-auto pb-12 flex flex-col">
          <div className="text-right -mx-3.5 max-sm:-mx-0.5">
            <IconButton onClick={() => setShowForm(false)}>
              <CloseCircle />
            </IconButton>
          </div>
          <Typography variant="h4" sx={{ mb: 4 }}>
            {edit ? "Replace Item" : "Add new item"}
          </Typography>
          <Form
            {...props}
            className="w-full mt-4"
            initialValue={initialValue}
            onSubmit={(data) => {
              setValue([
                ...value.slice(edit ? edit.index : 0),
                data[edit ? _id(edit.index) : _new],
                ...value.slice(edit ? edit.index + 1 : value.length),
              ]);
            }}
          >
            <ModelFormField
              name={edit ? _id(edit.index) : _new}
              meta={meta.arrayType}
            />
            <FormSubmit>{edit ? "Update" : "Save"}</FormSubmit>
          </Form>
        </Paper>
      </Modal>
    </>
  );
}

export default function ModelFormArrayField({ name, ...props }) {
  return <FormField name={name} as={ArrayField} {...props} />;
}
