import React, { useEffect, useState } from "react";
import CommentList from "../../components/comment/CommentList";
import Button from "../../components/button/Button";
import ShareButton from "../../components/shareButton/ShareButton";
import ComponentLoading from "../../components/loading/ComponentLoading";
import { FaRegPaperPlane } from "react-icons/fa";
import {
  useGetBlogQuery,
  useGetBlogCommentsQuery,
  useCommentBlogMutation,
  useDeleteCommentBlogMutation,
  useDeleteBlogMutation,
} from "../../features/blog/blogApiSlice";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import dateFormat from "../../common/dateFormat";
import { toast } from "react-toastify";
import { IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button as MuiButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const SingleBlog = () => {
  const user = useAuth();
  const { id } = useParams();
  const [commentPage, setCommentPage] = useState(1);
  const [commentError, setCommentError] = useState("");
  useEffect(() => { setCommentPage(1); }, [id]);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => { setImageFailed(false); }, [id]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const { data, ...rest } = useGetBlogQuery(id);
  useTitle(data?.title ? `${data.title} | Recipen` : "Recipen - Story");
  const comments = useGetBlogCommentsQuery({ blogId: id, page: commentPage });
  const [commentBlog, { isLoading }] = useCommentBlogMutation();
  const [deleteComment] = useDeleteCommentBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [formDetails, setFormDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });

  const handleChange = (e) => {
    if (e.target.id === "message") setCommentError("");
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
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
        commentBlog({ blogId: id, comment: formDetails.message.trim() }).unwrap(),
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
        deleteComment({ blogId: id, commentId: _id }).unwrap(),
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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuDelete = async () => {
    setDeleteError("");
    try {
      await deleteBlog(data._id).unwrap();
      setConfirmDelete(false);
      navigate("/blog");
    } catch (error) {
      setDeleteError(error?.data?.message || "Could not delete story. Please try again.");
    }
  };

  return (
    <>
      {rest?.isLoading ? (
        <ComponentLoading />
      ) : rest.isError || !data ? (
        <section className="box py-12 text-center">
          <h1 className="text-2xl font-bold">Story unavailable</h1>
          <p className="mt-3 text-gray-600">{rest.error?.status === 404 ? "This story could not be found." : "We could not load this story. Please try again."}</p>
          {rest.error?.status !== 404 && <button type="button" onClick={rest.refetch} className="mt-4 mr-4 underline">Try again</button>}
          <Link to="/blog" className="mt-4 inline-block underline">Browse stories</Link>
        </section>
      ) : (
        <section className="box flex flex-col gap-8 pt-5 md:pt-8">
          <article className="mx-auto w-full max-w-4xl">
            <Link to={/^\/blog(?:\/my-blogs)?(?:\?.*)?$/.test(location.state?.returnTo || "") ? location.state.returnTo : "/blog"} state={{ restoreScroll: true }} className="inline-block text-sm font-semibold text-[#675745] underline underline-offset-4">← {/^\/blog(?:\/my-blogs)?(?:\?.*)?$/.test(location.state?.returnTo || "") ? "Back to results" : "All stories"}</Link>
            <div className="mt-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">Stories from the kitchen</p>
                <h1 className="mt-3 break-words font-serif text-4xl leading-tight text-[#29251f] sm:text-5xl md:text-6xl">{data.title}</h1>
                <p className="mt-5 text-sm text-[#6b6257]">By {data.author?.name || "Recipen community"}{data.createdAt && !Number.isNaN(new Date(data.createdAt).getTime()) ? ` · ${dateFormat(data.createdAt)}` : ""}</p>
              </div>
              <div className="flex items-start gap-2"><ShareButton type="story" url={`${import.meta.env.VITE_BASE_URL || window.location.origin}/blog/${data._id}`} />
              {user && data?.author?._id === user.userId && (
                <>
                  <IconButton aria-label="Story actions" aria-controls={open ? "blog-actions-menu" : undefined} aria-expanded={open ? "true" : undefined} aria-haspopup="true" size="small" onClick={handleMenu}><MoreVert /></IconButton>
                  <Menu id="blog-actions-menu" anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                    <MenuItem component={Link} to={`/blog/edit/${id}`} onClick={handleMenuClose}>Edit</MenuItem>
                    <MenuItem onClick={() => { setAnchorEl(null); setDeleteError(""); setConfirmDelete(true); }}>Delete</MenuItem>
                  </Menu>
                </>
              )}</div>
            </div>
            <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-[#f2ece2]">
              {data.image && !imageFailed ? <img src={data.image} alt={data.title} className="h-full w-full object-cover" onError={() => setImageFailed(true)} /> : <span className="flex h-full items-center justify-center font-serif text-xl text-[#8a7e6f]">Story photo unavailable</span>}
            </div>
            <div className="recipen-article mx-auto mt-10 max-w-[68ch] sm:mt-14"><ReactMarkdown>{data.description || ""}</ReactMarkdown></div>
          </article>
          <hr />
          {/* Blog comment form */}
          <div className="my-6 w-full sm:w-2/3 md:w-1/2 mx-auto flex flex-col gap-6">
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
          {/* Blog comments */}
          <CommentList data={comments.currentData} isFetching={comments.isFetching} isError={comments.isError} refetch={comments.refetch} page={commentPage} setPage={setCommentPage} userId={user?.userId} onDelete={handleDeleteComment} />
        </section>
      )}
      <Dialog open={confirmDelete} onClose={isDeleting ? undefined : () => setConfirmDelete(false)} aria-labelledby="delete-own-blog-title">
        <DialogTitle id="delete-own-blog-title">Delete story?</DialogTitle>
        <DialogContent><DialogContentText>{data?.title} will be permanently deleted.</DialogContentText>{deleteError && <DialogContentText color="error" role="alert">{deleteError}</DialogContentText>}</DialogContent>
        <DialogActions><MuiButton disabled={isDeleting} onClick={() => setConfirmDelete(false)}>Cancel</MuiButton><MuiButton disabled={isDeleting} onClick={handleMenuDelete} color="error">Delete</MuiButton></DialogActions>
      </Dialog>
    </>
  );
};

export default SingleBlog;
