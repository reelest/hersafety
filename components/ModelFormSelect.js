import { search } from "@/logic/search";
import { FormField } from "./Form";
import { createContext, useContext, useMemo, useState } from "react";
import useIterator from "@/utils/useIterator";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import ModelItemPreview from "./ModelItemPreview";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDebounce } from "react-use";
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
export default function ModelFormSelect(props) {
  return <FormField as={RefField} {...props} />;
}

function RefField({
  groupBy,
  getOptionLabel,
  renderGroup,
  inputProps,
  name,
  id,
  meta,
  value,
  onChange,
  ...props
}) {
  const [filterText, setFilterText] = useState("");
  const [filter, setFilter] = useState("");
  useDebounce(
    () => {
      setFilter(filterText);
    },
    1000,
    [filterText]
  );
  const query = meta[name].refSearchQuery;
  const resultIterator = useMemo(
    () =>
      typeof query === "string"
        ? search(filter, query.split(" ").filter(Boolean))
        : query.iterator(0),
    [filter, query]
  );
  const isSearch = typeof query === "string";
  const iterator = useIterator(resultIterator);
  const { results, loading } = iterator;
  const active = results.find(
    (e) => value === (isSearch ? e.getItemId() : e.id())
  );
  return (
    <iteratorContext.Provider value={iterator}>
      <Autocomplete
        disablePortal
        renderOption={(props, option) => (
          <ModelItemPreview item={option} {...props} />
        )}
        {...{ groupBy, getOptionLabel, renderGroup }}
        id={id}
        options={results}
        value={active}
        onChange={(_, e) =>
          onChange({ target: { value: isSearch ? e.getItemId() : e.id() } })
        }
        inputValue={filterText}
        onInputChange={(_, value) => setFilterText(value)}
        loading={loading && !results?.length}
        sx={{ width: 300 }}
        filterOptions={(x) => x}
        ListboxComponent={InfiniteList}
        ListboxProps={{}}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            inputProps={{
              ...inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
            InputProps={{
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            {...props}
          />
        )}
      />
    </iteratorContext.Provider>
  );
}

function InfiniteList({ children }) {
  const { done, loadMore } = useContext(iteratorContext);
  return (
    <InfiniteScroll
      dataLength={children.length}
      next={loadMore}
      hasMore={!done} // Replace with a condition based on your data source
      loader={<p>Loading...</p>}
      endMessage={<p>No more data to load.</p>}
    >
      <ul>{children}</ul>
    </InfiniteScroll>
  );
}
