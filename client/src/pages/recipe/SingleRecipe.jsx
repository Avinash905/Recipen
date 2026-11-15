import React, { useEffect, useState } from "react";
import CommentList from "../../components/comment/CommentList";
import Button from "../../components/button/Button";
import ShareButton from "../../components/shareButton/ShareButton";
import ComponentLoading from "../../components/loading/ComponentLoading";
import { FaRegPaperPlane } from "react-icons/fa";
import { LuChefHat } from "react-icons/lu";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {
  useGetRecipeQuery,
  useGetRecipeCommentsQuery,
  useRateRecipeMutation,
  useCommentRecipeMutation,
  useDeleteCommentRecipeMutation,
  useToggleFavoriteMutation,
  useDeleteRecipeMutation,
} from "../../features/recipe/recipeApiSlice";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Rating, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button as MuiButton } from "@mui/material";
import { toast } from "react-toastify";
import { setCredentials, sameSession } from "../../features/auth/authSlice";
import { useDispatch, useStore } from "react-redux";
import { MoreVert } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const SingleRecipe = () => {
  const user = useAuth();
  const [rating, setRating] = useState(0);
  const { id } = useParams();
  const [commentPage, setCommentPage] = useState(1);
  const [commentError, setCommentError] = useState("");
  useEffect(() => { setCommentPage(1); }, [id]);
  const [imageFailed, setImageFailed] = useState(false);
  const [checks, setChecks] = useState({});
  useEffect(() => {
    try { setChecks(JSON.parse(localStorage.getItem(`recipen-checklist-${id}`) || "{}")); }
    catch { setChecks({}); }
  }, [id]);
  const changeCheck = (key, checked) => {
    setChecks((previous) => {
      const next = { ...previous, [key]: checked };
      try { localStorage.setItem(`recipen-checklist-${id}`, JSON.stringify(next)); } catch { /* Storage can be unavailable. */ }
      return next;
    });
  };
  const resetChecks = () => {
    setChecks({});
    try { localStorage.removeItem(`recipen-checklist-${id}`); } catch { /* Storage can be unavailable. */ }
  };
  useEffect(() => { setImageFailed(false); }, [id]);
  const dispatch = useDispatch();
  const store = useStore();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;
  const backToSaved = typeof returnTo === "string" && /^\/recipe\/saved(?:\?.*)?$/.test(returnTo);
  const backToSearch = typeof returnTo === "string" && /^\/recipe(?:\?.*)?$/.test(returnTo);
  const backToMine = typeof returnTo === "string" && /^\/recipe\/my-recipes(?:\?.*)?$/.test(returnTo);

  const { data, ...rest } = useGetRecipeQuery(id);
  useTitle(data?.title ? `${data.title} | Recipen` : "Recipen - Recipe");
  const comments = useGetRecipeCommentsQuery({ recipeId: id, page: commentPage });
  const [rateRecipe, { isLoading: isRating }] = useRateRecipeMutation();
  const [commentRecipe, { isLoading }] = useCommentRecipeMutation();
  const [deleteComment] = useDeleteCommentRecipeMutation();
  const [toggleFavorite, { isLoading: isSavingFavorite }] = useToggleFavoriteMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [formDetails, setFormDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });

  const sumOfRatings = data?.ratings.reduce(
    (sum, item) => sum + item.rating,
    0
  );
  const averageRating =
    sumOfRatings === 0 ? 0 : sumOfRatings / data?.ratings.length;

  const handleChange = (e) => {
    if (e.target.id === "message") setCommentError("");
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleRating = async (event, newValue) => {
    try {
      if (!user) {
        toast.error("You must sign in first");
        return navigate("/auth/signin", { state: { from: location } });
      }
      if (newValue === null) return;
      await toast.promise(
        rateRecipe({ rating: newValue, recipeId: id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Rating saved successfully",
          error: { render: ({ data: error }) => error?.data?.message || "Could not add rating" },
        }
      );
      setRating(newValue);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must sign in first");
      return navigate("/auth/signin", { state: { from: location } });
    }
    if (!formDetails.message.trim()) { setCommentError("Enter a comment before posting."); return; }
    setCommentError("");
    try {
      await toast.promise(
        commentRecipe({ recipeId: id, comment: formDetails.message.trim() }).unwrap(),
        {
          pending: "Please wait...",
          success: "Comment added",
          error: "Could not add comment",
        }
      );
      if (comments.currentData) setCommentPage(Math.max(1, Math.ceil((comments.currentData.total + 1) / comments.currentData.limit)));
      setFormDetails({ ...formDetails, message: "" });
    } catch (error) {
      setCommentError(error?.data?.message || "Could not post your comment. Check your connection and try again.");
    }
  };

  const handleDeleteComment = async (_id) => {
    try {
      await toast.promise(
        deleteComment({ recipeId: id, commentId: _id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Comment deleted",
          error: "Could not delete comment",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (!user) {
        toast.error("You must sign in first");
        return navigate("/auth/signin", { state: { from: location } });
      }

      const startingToken = store.getState().auth.token;
      const userData = await toast.promise(
        toggleFavorite({ recipeId: id, saved: !user?.favorites?.includes(id) }).unwrap(),
        {
          pending: "Please wait...",
          success: "Favorites updated",
          error: "Unable to update favorites",
        }
      );
      if (sameSession(store.getState().auth.token, startingToken)) dispatch(setCredentials({ ...userData }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuDelete = async () => {
    setDeleteError("");
    try {
      await deleteRecipe(data._id).unwrap();
      setConfirmDelete(false);
      navigate("/recipe");
    } catch (error) {
      setDeleteError(error?.data?.message || "Could not delete recipe. Please try again.");
    }
  };

  return (
    <>
      {rest?.isLoading ? (
        <ComponentLoading />
      ) : rest.isError || !data ? (
        <section className="box py-12 text-center">
          <h1 className="text-2xl font-bold">Recipe unavailable</h1>
          <p className="mt-3 text-gray-600">{rest.error?.status === 404 ? "This recipe could not be found." : "We could not load this recipe. Please try again."}</p>
          {rest.error?.status !== 404 && <button type="button" onClick={rest.refetch} className="mt-4 mr-4 underline">Try again</button>}
          <Link to="/recipe" className="mt-4 inline-block underline">Browse recipes</Link>
        </section>
      ) : (
        <section className="box flex flex-col gap-8 pt-5 md:pt-8">
          <Link to={backToSaved || backToSearch || backToMine ? returnTo : "/recipe"} state={{ restoreScroll: true }} className="w-fit text-sm font-semibold text-[#675745] underline underline-offset-4">← {backToSaved ? "Saved recipes" : backToMine ? "My recipes" : backToSearch ? "Back to results" : "All recipes"}</Link>
          <div className="grid gap-7 md:grid-cols-2 md:items-center md:gap-12">
            {/* Recipe image */}
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#f2ece2]">
              {data?.image && !imageFailed ? <img src={data.image} alt={data.title} className="h-full w-full object-cover" onError={() => setImageFailed(true)} /> : <span className="flex h-full items-center justify-center font-serif text-xl text-[#8a7e6f]">Recipe photo unavailable</span>}
            </div>
            {/* Recipe details */}
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex justify-between">
                <h1 className="font-serif text-4xl leading-tight text-[#29251f] md:text-5xl">{data?.title}</h1>
                {user && data?.author?._id === user.userId && (
                  <>
                    <IconButton
                      aria-label="Recipe actions"
                      id="long-button"
                      aria-controls={open ? "long-menu" : undefined}
                      aria-expanded={open ? "true" : undefined}
                      aria-haspopup="true"
                      size="small"
                      onClick={handleMenu}
                    >
                      <MoreVert />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      MenuListProps={{
                        "aria-labelledby": "long-button",
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleMenuClose}
                    >
                      <MenuItem component={Link} to={`/recipe/edit/${id}`} onClick={handleMenuClose}>Edit</MenuItem>
                      <MenuItem onClick={() => { setAnchorEl(null); setDeleteError(""); setConfirmDelete(true); }}>Delete</MenuItem>
                    </Menu>
                  </>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="flex gap-2 items-center font-semibold">
                  <LuChefHat className="text-primary" />
                  {data?.author?.name}
                </p>
                <div className="flex gap-2 p-2 bg-light rounded-l-lg">
                  <button
                    type="button"
                    aria-label={user?.favorites?.includes(id) ? "Remove from saved recipes" : "Save recipe"}
                    aria-pressed={Boolean(user?.favorites?.includes(id))}
                    disabled={isSavingFavorite}
                    onClick={handleToggleFavorite}
                    className="text-2xl text-red-500 disabled:opacity-50"
                  >
                    {user?.favorites?.includes(id) ? <AiFillHeart aria-hidden="true" /> : <AiOutlineHeart aria-hidden="true" />}
                  </button>
                  <ShareButton
                    url={`${import.meta.env.VITE_BASE_URL || window.location.origin}/recipe/${data?._id}`}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#62584b]">
                <Rating value={averageRating || 0} precision={0.1} size="small" readOnly />
                <span>{data?.ratings?.length ? `${averageRating.toFixed(1)} (${data.ratings.length} ${data.ratings.length === 1 ? "rating" : "ratings"})` : "Not rated yet"}</span>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3 border-y border-[#e8e1d7] py-4 text-sm">
                {data?.cookingTime && <div><span className="block text-[#776d60]">Cook time</span><strong>{data.cookingTime} minutes</strong></div>}
              </div>
              <nav aria-label="Recipe sections" className="mt-2 flex flex-wrap gap-3">
                <a href="#ingredients" className="rounded-full bg-[#29251f] px-5 py-3 text-sm font-semibold text-white">Jump to recipe</a>
                <a href="#method" className="rounded-full border border-[#cfc6ba] px-5 py-3 text-sm font-semibold text-[#493b2b]">Method</a>
                <a href="#comments" className="rounded-full border border-[#cfc6ba] px-5 py-3 text-sm font-semibold text-[#493b2b]">Comments</a>
              </nav>
              <p className="mt-2 max-w-2xl leading-7 text-[#62584b]">{data?.description}</p>
            </div>
          </div>
          <hr />
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
            {/* Recipe Ingredients */}
            <div className="h-fit rounded-3xl border border-[#e8e1d7] bg-[#f8f3eb] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">Before you begin</p>
              <h2 id="ingredients" className="mt-3 scroll-mt-24 font-serif text-3xl">Ingredients</h2><p className="mt-2 text-sm leading-6 text-[#6b6257]">Check off items as you cook. Progress is saved on this device.</p><button type="button" onClick={resetChecks} className="mt-4 text-sm font-semibold text-[#775421] underline underline-offset-4">Reset checklist</button>
              <ul className="mt-6 divide-y divide-[#e3d9ca]">
                {data?.ingredients?.map((ingredient, i) => (
                  <li key={`ingredient-${i + 1}`}>
                    <label className="flex cursor-pointer items-start gap-3 py-4 leading-6">
                      <input type="checkbox" checked={Boolean(checks[`ingredient-${i}-${ingredient}`])} onChange={(event) => changeCheck(`ingredient-${i}-${ingredient}`, event.target.checked)} className="cooking-check mt-0.5" />
                      <span className={checks[`ingredient-${i}-${ingredient}`] ? "text-[#776d60] line-through" : "text-[#29251f]"}>{ingredient}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            {/* Recipe Instructions */}
            <div className="flex flex-col gap-5">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">Let’s get cooking</p><h2 id="method" className="mt-3 scroll-mt-24 font-serif text-3xl">Method</h2><p className="mt-2 text-sm text-[#6b6257]">Mark each step as you finish it.</p></div>
              <ol className="flex flex-col gap-4">
                {data?.instructions?.map((instruction, i) => (
                  <li key={`instruction-${i + 1}`}>
                    <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 leading-7 transition-colors sm:p-6 ${checks[`step-${i}-${instruction}`] ? "border-[#d9cbb8] bg-[#f8f3eb]" : "border-[#e8e1d7] bg-white"}`}>
                      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3eadc] font-serif text-lg text-[#775421]">{String(i + 1).padStart(2, "0")}</span>
                      <span className={`min-w-0 flex-1 pt-1 ${checks[`step-${i}-${instruction}`] ? "text-[#776d60] line-through" : "text-[#433b32]"}`}>{instruction}</span>
                      <input type="checkbox" aria-label={`Mark step ${i + 1} complete`} checked={Boolean(checks[`step-${i}-${instruction}`])} onChange={(event) => changeCheck(`step-${i}-${instruction}`, event.target.checked)} className="cooking-check mt-2" />
                    </label>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <hr />
          {/* Rate recipe */}
          <div className="my-6 w-full sm:w-2/3 md:w-1/2 mx-auto flex flex-wrap items-center justify-between gap-4">
            <div><h3 className="font-bold text-2xl">Rate the recipe</h3>{data?.ratings?.some((obj) => obj.user === user?.userId) && <p className="mt-1 text-sm text-[#6b6257]">Your rating. Select another value to change it.</p>}</div>
            <Rating aria-label="Your recipe rating" size="large" precision={0.25} value={rating || data?.ratings?.find((obj) => obj.user === user?.userId)?.rating || 0} onChange={handleRating} disabled={isRating} sx={{ "& .MuiRating-iconEmpty": { color: "#776d60" }, "& .MuiRating-iconFilled": { color: "#a05b00" } }} />
          </div>
          <hr />
          {/* Recipe comment form */}
          <div className="my-10 w-full sm:w-2/3 md:w-1/2 mx-auto flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Leave a Reply</h3>
            {!user ? <p><Link to="/auth/signin" state={{ from: location }} className="font-semibold underline">Sign in</Link> to leave a comment.</p> : <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <p className="text-sm text-[#6b6257]">Commenting as {user?.name || "your account"}.</p>
              <div className="flex flex-col relative ">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold mb-3"
                >
                  Comment
                </label>
                <textarea
                  onChange={handleChange}
                  value={formDetails.message}
                  id="message"
                  aria-invalid={commentError ? "true" : undefined}
                  aria-describedby={commentError ? "comment-error" : undefined}
                  rows={4}
                  maxLength={2000}
                  required
                  aria-required="true"
                  placeholder="Leave a comment..."
                  className="rounded-xl border border-[#cfc6ba] bg-white px-4 py-3 focus:outline focus:outline-2 focus:outline-[#775421]"
                />
              </div>
              {commentError && <p id="comment-error" role="alert" className="text-sm text-red-700">{commentError}</p>}
              <Button
                content={"Post comment"}
                icon={<FaRegPaperPlane />}
                type={"submit"}
                customCss="max-w-max rounded-xl !bg-[#29251f] !px-6 !py-3 !text-white !shadow-none hover:!bg-[#443b30]"
                loading={isLoading}
              />
            </form>}
          </div>
          <hr />
          {/* Recipe comments */}
          <CommentList data={comments.currentData} isFetching={comments.isFetching} isError={comments.isError} refetch={comments.refetch} page={commentPage} setPage={setCommentPage} userId={user?.userId} onDelete={handleDeleteComment} />
        </section>
      )}
      <Dialog open={confirmDelete} onClose={isDeleting ? undefined : () => setConfirmDelete(false)} aria-labelledby="delete-own-recipe-title">
        <DialogTitle id="delete-own-recipe-title">Delete recipe?</DialogTitle>
        <DialogContent><DialogContentText>{data?.title} will be permanently deleted.</DialogContentText>{deleteError && <DialogContentText color="error" role="alert">{deleteError}</DialogContentText>}</DialogContent>
        <DialogActions><MuiButton disabled={isDeleting} onClick={() => setConfirmDelete(false)}>Cancel</MuiButton><MuiButton disabled={isDeleting} onClick={handleMenuDelete} color="error">Delete</MuiButton></DialogActions>
      </Dialog>
    </>
  );
};

export default SingleRecipe;
