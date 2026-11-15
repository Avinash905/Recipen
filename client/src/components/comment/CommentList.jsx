import P from "prop-types";
import { useEffect, useRef } from "react";
import Comment from "./Comment";

export default function CommentList({ data, isFetching, isError, refetch, page, setPage, userId, onDelete }) {
  const heading = useRef(null);
  const previousPage = useRef(page);
  const pendingFocus = useRef(false);
  useEffect(() => {
    if (previousPage.current !== page) { previousPage.current = page; pendingFocus.current = true; }
    if (pendingFocus.current && data?.page === page && !isFetching) { heading.current?.focus(); pendingFocus.current = false; }
  }, [page, data?.page, isFetching]);
  const totalPages = Math.max(1, Math.ceil((data?.total || 0) / (data?.limit || 10)));
  useEffect(() => {
    if (data?.page === page && !isFetching && page > totalPages) setPage(totalPages);
  }, [data?.page, isFetching, page, setPage, totalPages]);
  return <section className="w-full sm:w-4/5 mx-auto flex flex-col gap-6" aria-labelledby="comments">
    <h3 ref={heading} tabIndex={-1} id="comments" className="scroll-mt-24 font-bold text-2xl">Comments</h3>
    {isError && <p role="alert">{data ? "Could not refresh comments. Showing the last loaded comments. " : "Could not load comments. "}<button type="button" className="underline" onClick={refetch}>Try again</button></p>}
    {isError && !data ? null : isFetching && !data ? <p role="status">Loading comments...</p>
        : data?.items?.length ? <div className="flex flex-col gap-6">{data.items.map((comment) => <Comment key={comment._id} comment={comment} userId={userId} handleDeleteComment={onDelete} />)}</div>
          : <p>{data?.total && page > 1 ? "No comments on this page." : "No comments yet."}</p>}
    {data?.total > 0 && <nav aria-label="Comment pages" className="flex flex-wrap items-center gap-4 text-sm">
      <button type="button" disabled={page <= 1 || isFetching} onClick={() => setPage(page - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button type="button" disabled={page >= totalPages || isFetching} onClick={() => setPage(page + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button>
    </nav>}
  </section>;
}

CommentList.propTypes = { data: P.shape({ items: P.array, total: P.number, page: P.number, limit: P.number }), isFetching: P.bool, isError: P.bool, refetch: P.func.isRequired, page: P.number.isRequired, setPage: P.func.isRequired, userId: P.string, onDelete: P.func.isRequired };
