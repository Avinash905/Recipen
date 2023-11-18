import React, { useState } from "react";
import {
  Comment,
  Button,
  Input,
  NoData,
  ComponentLoading,
} from "../../components";
import { IoMailOutline } from "react-icons/io5";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsFillPersonFill, BsCalendarCheck } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import {
  useGetBlogQuery,
  useCommentBlogMutation,
  useDeleteCommentBlogMutation,
  useDeleteBlogMutation,
} from "../../features/blog/blogApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import dateFormat from "../../common/dateFormat";
import { toast } from "react-toastify";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const SingleBlog = () => {
  useTitle("Recipen - Blog");

  const user = useAuth();
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const { data, ...rest } = useGetBlogQuery(id);
  const [commentBlog, { isLoading }] = useCommentBlogMutation();
  const [deleteComment] = useDeleteCommentBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [formDetails, setFormDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must sign in first");
      return navigate("/auth/signin");
    }
    try {
      await toast.promise(
        commentBlog({ blogId: id, comment: formDetails.message }).unwrap(),
        {
          pending: "Please wait...",
          success: "Comment added",
          error: "Could not add comment",
        }
      );
      setFormDetails({ ...formDetails, message: "" });
    } catch (error) {
      toast.error(error.data);
      console.error(error);
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
      toast.error(error.data);
      console.error(error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuDelete = () => {
    if (window.confirm("Are you sure you want to delete?")) {
      deleteBlog(data?._id);
      navigate("/blog");
    }
    setAnchorEl(null);
  };

  return (
    <>
      {rest?.isLoading ? (
        <ComponentLoading />
      ) : (
        <section className="box flex flex-col gap-8">
          <div className="w-3/4 mx-auto flex flex-col gap-4">
            <div className="flex justify-between">
              {/* Blog heading */}
              <h2 className="font-bold text-2xl md:text-4xl text-center mb-6">
                {data?.title}
              </h2>
              {data?.author?._id === user?.userId && (
                <>
                  <IconButton
                    aria-label="more"
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
                    <MenuItem>
                      <Link to={`/blog/edit/${id}`}>Edit</Link>
                    </MenuItem>
                    <MenuItem onClick={handleMenuDelete}>Delete</MenuItem>
                  </Menu>
                </>
              )}
            </div>
            {/* Blog image */}
            <img
              src={data?.image}
              alt={data?.title}
              className="rounded w-full h-[500px] object-cover object-center"
            />
            {/* Blog author & date */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="flex text-sm md:text-lg gap-2 items-center font-bold">
                <BsFillPersonFill className="text-primary" />
                {data?.author?.name}
              </h3>
              <span className="flex gap-2 items-center text-sm">
                <BsCalendarCheck />
                {data && dateFormat(data?.createdAt)}
              </span>
            </div>

            {/* Blog content */}
            <ReactMarkdown>{data?.description}</ReactMarkdown>
          </div>
          <hr />
          {/* Blog comment form */}
          <div className="my-6 w-full sm:w-2/3 md:w-1/2 mx-auto flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Leave a Reply</h3>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <Input
                type={"text"}
                id={"name"}
                icon={<AiOutlineUser />}
                handleChange={handleChange}
                value={formDetails.name}
                label={"Name"}
                placeholder={"John Doe"}
              />
              <Input
                type={"email"}
                id={"email"}
                icon={<IoMailOutline />}
                handleChange={handleChange}
                value={formDetails.email}
                label={"Email"}
                placeholder={"example@abc.com"}
              />
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
                  rows={4}
                  required
                  aria-required="true"
                  placeholder="Leave a comment..."
                  className="py-2 px-4 border bg-gray-100 rounded-lg focus:outline outline-primary"
                />
              </div>
              <Button
                content={"Post comment"}
                icon={<FaRegPaperPlane />}
                type={"submit"}
                customCss={"rounded-lg gap-3 max-w-max"}
                loading={isLoading}
              />
            </form>
          </div>
          <hr />
          {/* Blog comments */}
          <div className="w-full sm:w-4/5 mx-auto flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Comments</h3>
            {data?.comments?.length ? (
              <div className="flex flex-col gap-6">
                {data?.comments?.map((comment) => (
                  <Comment
                    key={comment?._id}
                    comment={comment}
                    userId={user?.userId}
                    handleDeleteComment={handleDeleteComment}
                  />
                ))}
              </div>
            ) : (
              <NoData text={"Comments"} />
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default SingleBlog;
