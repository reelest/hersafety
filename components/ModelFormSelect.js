import { FormField } from "./Form";

export default function ModelFormSelect({ prop, meta, ...props }) {
  const [filter, setFilter] = useState("");
  const resultIterator = useMemo(()=>search(
  const {data:items,loading} = usePagedQuery(()=>meta[prop].itemQuery);
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
        <MenuItem key={labels[i] ?? e} value={e}>
          {labels[i] ?? e}
        </MenuItem>
      ))}
    </FormField>
  );
}
