import TextInput, { TextInputDecor } from "@/components/TextInput";
import SearchIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";

export function SearchInput() {
  return (
    <TextInputDecor
      className="inline-block my-2 mx-8 w-96"
      startIcon={<SearchIcon />}
    >
      <TextInput placeholder="Search" variant="search" className="pl-14 pr-6" />
    </TextInputDecor>
  );
}
