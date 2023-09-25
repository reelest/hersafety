import { search } from "@/logic/search";
import { FormField } from "./Form";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useIterator from "@/utils/useIterator";
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import ModelItemPreview, { MODEL_ITEM_PREVIEW } from "./ModelItemPreview";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDebounce, useIntersection } from "react-use";
import { Item, USES_EXACT_IDS } from "@/models/lib/model";
import { IndexEntry } from "@/models/search_index";
import ModelFormDialog from "./ModelFormDialog";
import createQuery from "@/utils/createQuery";
import Template from "./Template";
import delay from "@/utils/delay";
import { ItemDoesNotExist, checkError } from "@/models/lib/errors";
import useStable from "@/utils/useStable";
import { AddCircle, CloseCircle } from "iconsax-react";
import { useOnCreateItem } from "./ModelForm";
import { getDefaultValue } from "../models/lib/model_type_info";
import { noop } from "@/utils/none";
import useLogger from "@/utils/useLogger";
/**
 * @type {import("react").Context<import("@/utils/useIterator").UseIterator<import("@/models/lib/model").Item>>}
 */
const iteratorContext = createContext();
/**
 *
 * @param {Object} props
 * @param {String} props.prop
 * @param {import("../models/lib/model_type_info").ModelTypeInfo} props.meta
 * @returns
 */
export default function ModelFormRefField(props) {
  return <FormField as={RefField} {...props} />;
}
const testIterator = async function* (i = 0) {
  while (true) {
    i += 10;
    await delay(6000);
    yield [
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
      "Helllo " + ++i,
    ];
  }
};
async function* asyncIteratorOf(func) {
  yield* await func();
}

const _id = (e) =>
  e instanceof IndexEntry ? e.getItemId() : e instanceof Item ? e.id() : e;

const _searchValue = (e) =>
  e instanceof IndexEntry
    ? e.tokens
    : e instanceof Item && e._isLoaded && e.model().Meta[MODEL_ITEM_PREVIEW]
    ? Object.values(e.model().Meta[MODEL_ITEM_PREVIEW](e)).join(" ")
    : typeof e === "string"
    ? e
    : "";
/**
 * @param {Object} params
 * @param {*} params.inputProps
 * @param {String} params.name
 * @param {String} params.id
 * @param {import("../models/lib/model_type_info").ModelPropInfo} params.meta
 * @param {*} params.value
 * @param {*} params.onChange
 * @param {Boolean} params.onChange
 * @param {Array<any>} params.props
 */
function RefField({
  name,
  id,
  meta,
  value,
  onChange,
  required,
  disabled,
  ...props
}) {
  const allowCreate = !meta.refModel.Meta[USES_EXACT_IDS];
  const newItem = useMemo(
    () => allowCreate && meta.refModel.create(),
    [meta, allowCreate]
  );
  const [open, setOpen] = useState(false);

  const query = useMemo(
    () =>
      meta.pickRefQuery === true ? meta.refModel.all() : meta.pickRefQuery,
    [meta]
  );

  const setValue = useStable((e) => {
    onChange({ target: { value: _id(e) } });
  });

  useLogger({ id, value, open, query });
  const activeItem = useMemo(
    () =>
      value &&
      (value === newItem?.id?.() ? newItem : meta.refModel.item(value)),
    [value, meta, newItem]
  );
  const onCreateItem = useOnCreateItem();
  useEffect(() => {
    (async () => {
      try {
        if (activeItem === newItem) {
          onCreateItem(activeItem);
        } else {
          await (activeItem && activeItem.load());
        }
      } catch (e) {
        checkError(e, ItemDoesNotExist);
        setValue(getDefaultValue(meta));
      }
    })();
  }, [activeItem, newItem, onCreateItem, setValue, meta]);
  return (
    <div className="flex items-end">
      <input
        name={name}
        value={value}
        onChange={noop}
        id={id}
        type="text"
        required={required}
        form={props?.inputProps?.form}
        style={{ padding: 0, maxWidth: 0, border: "none" }}
      />
      {query ? (
        <PickRef
          {...{
            value,
            disabled,
            setValue,
            activePreview: activeItem,
            query,
            props,
          }}
        />
      ) : (
        <>
          <ModelItemPreview item={activeItem} {...props} />
          {!disabled ? (
            <IconButton>
              <CloseCircle />
            </IconButton>
          ) : null}
        </>
      )}
      {!disabled && allowCreate ? (
        <>
          <ModelFormDialog
            edit={newItem}
            model={meta.refModel}
            noSave
            onSubmit={(data) => {
              newItem.setData(data);
              setValue(newItem.id());
            }}
            isOpen={open}
            onClose={() => setOpen(false)}
          />
          <IconButton onClick={() => setOpen(true)}>
            <AddCircle />
          </IconButton>
        </>
      ) : null}
    </div>
  );
}

/** @param {Object} params
 * @param {String} params.id
 * @param {String} params.name
 * @param {String} params.value
 * @param {import("../models/lib/model_type_info").ModelPropInfo} params.meta
 * @param {*} params.props  */

function PickRef({ value, disabled, setValue, activePreview, query, props }) {
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [serverFilter, setServerFilter] = useState("");
  const [clientFilter, setClientFilter] = useState(() =>
    createQuery(filterText)
  );
  useDebounce(
    () => {
      if (typeof query === "string") setServerFilter(filterText);
    },
    2000,
    [query, filterText]
  );
  useEffect(() => {
    setClientFilter(() => createQuery(filterText));
  }, [filterText]);

  const resultIterator = useMemo(
    () =>
      // testIterator(1000) ||
      typeof query === "string"
        ? search(serverFilter, query.split(" ").filter(Boolean))
        : typeof query === "function"
        ? asyncIteratorOf(query)
        : query
        ? query.iterator(0)
        : {
            next() {
              return { done: true };
            },
          },
    [serverFilter, query]
  );
  const iterator = useIterator(resultIterator);
  const { value: results, loading } = iterator;
  const active = results.find((e) => value === _id(e)) ?? null;
  const filterable = useMemo(() => results.some(_searchValue), [results]);
  return (
    <iteratorContext.Provider value={iterator}>
      <Autocomplete
        disablePortal
        renderOption={(props, option) => (
          <ModelItemPreview
            item={option}
            {...props}
            sx={{ width: "20rem", maxWidth: "100%", minWidth: 0, ...props.sx }}
            key={_id(option)}
          />
        )}
        // {...{ groupBy, getOptionLabel, renderGroup }}
        options={results}
        value={active}
        onChange={(_, e) => setValue(e)}
        getOptionLabel={() => ""}
        selectOnFocus
        handleHomeEndKeys
        clearOnBlur
        blurOnSelect
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={filterText}
        onInputChange={(_, value) => setFilterText(value)}
        loading={loading && query && !results?.length}
        filterOptions={(x) =>
          filterable
            ? x
                .map((e) => [clientFilter(_searchValue(e)), e])
                .sort((a, b) => b[0] - a[0])
                .map((e) => e[1])
            : x
        }
        disabled={disabled}
        ListboxComponent={InfiniteList}
        ListboxProps={{ elevation: 5 }}
        loadingText={<CircularProgress sx={{ display: "block", mx: "auto" }} />}
        renderInput={(params) => (
          <Template
            as={TextField}
            props={{
              ...props,
              inputProps: {
                ...params.inputProps,
                ...props.inputProps,
                autoComplete: "new-password",
                // disable autocomplete and autofill
              },
            }}
            sx={{
              ...params.sx,
              "& .MuiInputBase-root": {
                flexWrap: "nowrap",
              },
            }}
            {...params}
            value={filterText}
            InputProps={{
              ...params.InputProps,
              startAdornment: open
                ? null
                : activePreview && (
                    <ModelItemPreview
                      className="model-preview"
                      item={activePreview}
                      sx={{ mr: 4 }}
                    />
                  ),
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </iteratorContext.Provider>
  );
}

const InfiniteList = forwardRef(function InfiniteList(
  { children, ...props },
  ref
) {
  const ref2 = useRef();
  const isVisible = useIntersection(ref2, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  })?.isIntersecting;
  const { done, value, loadMore, loading } = useContext(iteratorContext);
  useDebounce(
    () => {
      if (isVisible && !loading) {
        loadMore();
      }
    },
    2000,
    [isVisible, loadMore, loading]
  );
  return (
    <div ref={ref} {...props}>
      {/* TODO: Remove this component since it is not working */}
      <InfiniteScroll
        dataLength={value.length}
        hasMore={!done} // Replace with a condition based on your data source
        loader={<LinearProgress ref={ref2} />}
        endMessage={
          <Typography
            variant="caption"
            color="text.disabled"
            textAlign="center"
            display="block"
            mx="auto"
          >
            ----- End -----
          </Typography>
        }
      >
        <ul>{children}</ul>
      </InfiniteScroll>
    </div>
  );
});
