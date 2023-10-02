import { useRouter } from "next/router";
import useStable from "./useStable";

export default function useQueryState(query, defaultValue) {
  const router = useRouter();
  const setQueryState = useStable((value) => {
    router.replace({
      query: {
        ...router.query,
        [query]: value ? encodeURIComponent(value) : undefined,
      },
    });
  });
  return [router.query[query] || defaultValue, setQueryState];
}
