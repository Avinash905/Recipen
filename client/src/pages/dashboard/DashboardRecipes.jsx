import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ComponentLoading from "../../components/loading/ComponentLoading";
import usePageBounds from "../../hooks/usePageBounds";
import Table from "../../components/dashboard/Table";
import { setRecipes } from "../../features/recipe/recipeSlice";
import { useDispatch } from "react-redux";
import {
  useGetRecipesQuery,
  useDeleteRecipeMutation,
} from "../../features/recipe/recipeApiSlice";
import { toast } from "react-toastify";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { Avatar as MuiAvatar, Rating } from "@mui/material";

const DashboardRecipes = () => {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Math.min(100000, parseInt(params.get("page"), 10) || 1));
  const search = params.get("search") || "";
  const changePage = (nextPage) => { const next = new URLSearchParams(params); next.set("page", String(nextPage)); setParams(next); };
  const changeSearch = (value) => { const next = new URLSearchParams(params); if (value) next.set("search", value); else next.delete("search"); next.set("page", "1"); setParams(next, { replace: true }); };
  const { currentData: data, isFetching: isLoading, isError, refetch } = useGetRecipesQuery({ page, limit: 12, search });
  usePageBounds(page, data, isLoading, setParams);

  const dispatch = useDispatch();
  const updatedData = data?.items?.map((item) => ({
    ...item,
    id: item._id,
  }));
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleteError("");
    try {
      await deleteRecipe(pendingDelete._id).unwrap();
      setPendingDelete(null);
      toast.success("Deleted successfully");
    } catch (error) {
      setDeleteError(error?.data?.message || "Could not delete item. Please try again.");
    }
  };

  useEffect(() => {
    if (!isLoading) {
      dispatch(setRecipes(data?.items));
    }
  }, [isLoading, data, dispatch]);

  const cols = [
    {
      field: "title",
      headerName: "Title",
      width: 280,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "author",
      headerName: "Author",
      headerAlign: "center",
      align: "left",
      minWidth: 250,
      renderCell: ({ row: { author } }) => {
        return (
          <div className="flex gap-2 items-center">
            <MuiAvatar
              alt={author?.name}
              src={author?.profilePicture}
              sx={{ width: 36, height: 36 }}
              className="border-2 border-primary"
            />
            {author?.name || "Unknown author"}
          </div>
        );
      },
    },
    {
      field: "ratings",
      headerName: "Rating",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { ratings } }) => {
        const sumOfRatings = ratings.reduce(
          (sum, item) => sum + item.rating,
          0
        );
        const averageRating =
          sumOfRatings === 0 ? 0 : sumOfRatings / ratings.length;
        return (
          <Rating
            value={averageRating}
            readOnly={true}
            size={"medium"}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      minWidth: 250,
      renderCell: ({ row }) => {
        return (
          <button type="button" className="rounded-lg border border-[#e8c1ba] bg-[#fff7f5] px-4 py-2 font-semibold text-[#9f3629] hover:bg-[#fcebe7]" onClick={() => { setDeleteError(""); setPendingDelete(row); }}>
            Delete
          </button>
        );
      },
    },
  ];

  return (
    <>
    <section className="mx-auto flex h-screen min-w-0 w-full flex-col px-3 py-6 sm:px-8">
      <header className="mb-5 shrink-0"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">Dashboard</p><h1 className="mt-2 font-serif text-3xl">Recipes</h1><p className="mt-1 text-sm text-[#6b6257]">Review and moderate recipes.</p></header>
      <label className="mb-3 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:items-center">Search recipes<input type="search" value={search} onChange={(event) => changeSearch(event.target.value)} className="w-full max-w-full rounded-lg border border-[#cfc6ba] px-3 py-2 font-normal sm:w-auto" placeholder="Title" /></label>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-2xl border border-[#e8e1d7] bg-white p-2 sm:p-4">
        {isLoading ? <ComponentLoading /> : isError ? <div role="alert" className="p-4">Could not load recipes. <button type="button" onClick={refetch} className="underline">Try again</button></div> : updatedData?.length === 0 ? <div className="p-4" role="status"><p>{search ? "No matching results." : "No items yet."}</p>{search && <button type="button" className="mt-3 underline" onClick={() => changeSearch("")}>Clear search</button>}</div> : <><div className="hidden h-full xl:block"><Table rows={updatedData} cols={cols} /></div><div className="space-y-3 xl:hidden">{updatedData?.length === 0 && <p className="p-4 text-sm text-[#6b6257]">No matching results.</p>}{updatedData?.map((row) => <article key={row.id} className="rounded-xl border border-[#e8e1d7] p-4"><h2 className="break-words font-semibold">{row.title}</h2><p className="mt-1 text-sm text-[#6b6257]">{row.author?.name || "Unknown author"}</p><button type="button" className="mt-3 rounded-lg border border-[#e8c1ba] bg-[#fff7f5] px-4 py-2 font-semibold text-[#9f3629] hover:bg-[#fcebe7]" onClick={() => { setDeleteError(""); setPendingDelete(row); }}>Delete</button></article>)}</div></>}
      </div>
      {!isLoading && !isError && <nav aria-label="Recipes pages" className="mt-3 flex flex-wrap items-center gap-3 text-sm"><button type="button" disabled={page <= 1} onClick={() => changePage(page - 1)} className="rounded border px-3 py-2 disabled:opacity-40">Previous</button><span>Page {page} of {Math.max(1, Math.ceil((data?.total || 0) / 12))} · {data?.total || 0} total</span><button type="button" disabled={page * 12 >= (data?.total || 0)} onClick={() => changePage(page + 1)} className="rounded border px-3 py-2 disabled:opacity-40">Next</button></nav>}
    </section>
    <Dialog open={Boolean(pendingDelete)} onClose={isDeleting ? undefined : () => setPendingDelete(null)} aria-labelledby="delete-recipe-title">
      <DialogTitle id="delete-recipe-title">Delete recipe?</DialogTitle>
      <DialogContent><DialogContentText>{pendingDelete?.title} will be permanently deleted.</DialogContentText>{deleteError && <DialogContentText color="error" role="alert">{deleteError}</DialogContentText>}</DialogContent>
      <DialogActions>
        <Button disabled={isDeleting} onClick={() => setPendingDelete(null)}>Cancel</Button>
        <Button disabled={isDeleting} onClick={handleDelete} color="error">Delete</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default DashboardRecipes;
