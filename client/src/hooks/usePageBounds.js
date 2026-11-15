import { useEffect } from "react";

export default function usePageBounds(page, data, isFetching, setParams) {
  useEffect(() => {
    if (!data || isFetching) return;
    const lastPage = Math.max(1, Math.ceil(data.total / data.limit));
    if (page > lastPage) setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (lastPage === 1) next.delete("page"); else next.set("page", String(lastPage));
      return next;
    }, { replace: true });
  }, [page, data, isFetching, setParams]);
}
