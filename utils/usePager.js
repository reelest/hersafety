import { useCallback, useEffect, useState } from "react";

export default function usePager(data, pageSize = 10) {
  const [page, setPage] = useState(0);
  const clamp = useCallback(
    (page) => Math.min(Math.ceil(data.length / pageSize), Math.max(1, page)),
    [data, pageSize]
  );
  useEffect(() => setPage(clamp(page)), [page, clamp]);
  return {
    goNext() {
      setPage(clamp(page + 1));
    },
    goPrev() {
      setPage(clamp(page - 1));
    },
    numPages: clamp(Infinity),
    data: data.slice(pageSize * (page - 1), pageSize * page),
    hasNext: clamp(page + 1) > page,
    hasPrev: clamp(page - 1) < page,
    goto: setPage,
    page,
    count: data.length === Number.MAX_SAFE_INTEGER ? undefined : data.length,
    pageSize,
  };
}
