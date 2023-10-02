import { Box, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Add, Edit, Trash } from "iconsax-react";
import { useQuery } from "@/models/lib/query";
import { singular } from "@/utils/plural";
import sentenceCase from "@/utils/sentenceCase";
import { useMutex } from "@/utils/mutex";
import ModelFormDialog from "./ModelFormDialog";
import ThemedTable from "./ThemedTable";
import { supplyModelValues } from "./ModelDataView";
import capitalize from "@/utils/capitalize";
import { addClassToColumns, addHeaderClass, supplyValue } from "./Table";
import { None, noop } from "@/utils/none";

export default function ModelTable({
  Model,
  Query = Model.all(),
  props = Model.fields(),
  headers = props.map((e) => capitalize(Model?.Meta?.[e]?.label ?? e)),
  modelName = sentenceCase(Model.uniqueName()),
  addActionTitle = "Create " + singular(modelName),
  allowEdit = true,
  allowDelete = true,
  allowCreate = true,
  enablePrint = false,
  onClickRow = noop,
  pluralTitle = sentenceCase(modelName),
  onCreate,
  renderHooks = [],
  deps = [],
}) {
  const { data: items, pager } = useQuery(
    () => Query?.pageSize?.(10),
    [...deps],
    {
      watch: true,
    }
  );
  const [formVisible, setFormVisible] = useState(false);
  const [item, setItem] = useState(null);
  useEffect(() => {
    if (!formVisible) {
      setItem(null);
    }
  }, [formVisible]);
  const showModal = (row) => {
    setItem(items[row]);
    setFormVisible(true);
  };
  const createItem = useMutex(async () => {
    if (allowCreate) {
      const item = (await onCreate?.()) ?? null;
      if (item !== false) {
        setItem(item);
        setFormVisible(true);
      }
    }
  });
  const actions = [allowEdit ? "e" : "", allowDelete ? "d" : ""].filter(
    Boolean
  );
  return (
    <>
      {allowCreate ? (
        <ModelFormDialog
          isOpen={formVisible}
          edit={item}
          onChange={console.log}
          onClose={() => setFormVisible(false)}
          model={Model}
        />
      ) : null}

      <Box className="px-4 sm:px-8 py-8">
        <div className="flex flex-wrap justify-between mx-2">
          <Typography variant="h6" as="h2">
            {pluralTitle}
          </Typography>
        </div>
        {allowCreate ? (
          <div className="flex flex-wrap pt-0 justify-end mx-2">
            <Button
              variant="contained"
              size="large"
              onClick={createItem}
              disabled={!Query}
            >
              {addActionTitle} <Add size={32} className="ml-2" />
            </Button>
          </div>
        ) : null}
        <ThemedTable
          // title={pluralTitle}
          headers={headers.concat(actions.map(() => ""))}
          results={Query ? items : []}
          pager={pager}
          enablePrint={enablePrint}
          onClickRow={(_, row) => onClickRow(items[row])}
          rowProps={{
            ...(onClickRow !== noop
              ? {
                  sx: {
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "gray.light",
                    },
                  },
                }
              : None),
          }}
          renderHooks={[
            addHeaderClass("pr-4"),
            addClassToColumns("w-0 pt-0 pb-0", [
              props.length,
              props.length + 1,
            ]),
            supplyModelValues(props),
            supplyValue((row, col, data) => {
              col -= props.length;
              switch (actions[col]) {
                case "e":
                  return (
                    <IconButton color="primary" onClick={() => showModal(row)}>
                      <Edit />
                    </IconButton>
                  );
                case "d":
                  return (
                    <IconButton
                      color="error"
                      onClick={async () => {
                        if (await confirm("Delete selected item")) {
                          await data[row].delete();
                        }
                      }}
                    >
                      <Trash />
                    </IconButton>
                  );
              }
              return data;
            }),
            ...renderHooks,
          ]}
        />
      </Box>
    </>
  );
}
