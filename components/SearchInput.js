import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import { SearchNormal1 as SearchIcon } from "iconsax-react";
import Template from "./Template";
import ModelItemPreview, { MODEL_ITEM_PREVIEW } from "./ModelItemPreview";
import { useEffect, useMemo, useState } from "react";
import useIterator from "@/utils/useIterator";
import { search } from "@/logic/search";
import createQuery from "@/utils/createQuery";
import { useDebounce } from "react-use";
import { IndexEntry } from "@/models/search_index";
import { Item } from "@/models/lib/model";
import pick from "@/utils/pick";
import notIn from "@/utils/notIn";
export const _searchValue = (e) =>
  e instanceof IndexEntry
    ? e.tokens
    : e instanceof Item && e._isLoaded && e.model().Meta[MODEL_ITEM_PREVIEW]
    ? Object.values(e.model().Meta[MODEL_ITEM_PREVIEW](e)).join(" ")
    : typeof e === "string"
    ? e
    : "";

export const _id = (e) =>
  e instanceof IndexEntry ? e.getItem().id : e instanceof Item ? e.id() : e;

export function SearchInput() {
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [serverFilter, setServerFilter] = useState("");
  const [clientFilter, setClientFilter] = useState(() =>
    createQuery(filterText)
  );
  useDebounce(
    () => {
      setServerFilter(filterText);
    },
    2000,
    [filterText]
  );
  useEffect(() => {
    setClientFilter(() => createQuery(filterText));
  }, [filterText]);

  const resultIterator = useMemo(
    () => search(serverFilter, ["clients"], 1),
    [serverFilter]
  );
  const iterator = useIterator(resultIterator);
  const { value: results, loading } = iterator;
  const filterable = useMemo(() => results.some(_searchValue), [results]);
  return (
    <Autocomplete
      disablePortal
      renderOption={(props, option) => (
        <ModelItemPreview item={option} {...props} key={_id(option)} />
      )}
      // {...{ groupBy, getOptionLabel, renderGroup }}
      options={results}
      onChange={(_, e) => {
        alert(e.uniqueName());
      }}
      getOptionLabel={() => ""}
      handleHomeEndKeys
      open={open}
      sx={{
        flexGrow: 100,
        maxWidth: "27rem",
      }}
      freeSolo
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={filterText}
      onInputChange={(_, value) => setFilterText(value)}
      loading={loading && !results?.length}
      filterOptions={(x) =>
        filterable
          ? x
              .map((e) => [clientFilter(_searchValue(e)), e])
              .sort((a, b) => b[0] - a[0])
              .map((e) => e[1])
          : x
      }
      ListboxProps={{ elevation: 5 }}
      loadingText={<CircularProgress sx={{ display: "block", mx: "auto" }} />}
      renderInput={(params) => (
        <OutlinedInput
          // as={OutlinedInput}
          placeholder="Search"
          {...pick(
            params,
            Object.keys(params).filter(notIn(["InputProps", "InputLabelProps"]))
          )}
          sx={{
            ...params.sx,
            "& .MuiInputBase-root": {
              flexWrap: "nowrap",
            },
            maxWidth: "27rem",
            backgroundColor: "gray.light",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
          }}
          size="small"
          value={filterText}
          {...{
            ...params.InputProps,
            startAdornment: (
              <Box as={SearchIcon} size={20} className="mr-3 text-inherit" />
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
  );
}
