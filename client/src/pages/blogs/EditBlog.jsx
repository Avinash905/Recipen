import React, { useEffect, useState } from "react";
import { Button, ComponentLoading } from "../../components";
import { photo } from "../../assets";
import uploadImage from "../../common/uploadImage";
import { LinearProgress } from "@mui/material";
import { toast } from "react-toastify";
import {
  useGetBlogQuery,
  useUpdateBlogMutation,
} from "../../features/blog/blogApiSlice";
import { useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();

  const { data, ...rest } = useGetBlogQuery(id);
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  const [formDetails, setFormDetails] = useState({
    title: data?.title || "",
    image: data?.image || "",
    description: data?.description || "",
  });
  const [progress, setProgress] = useState(0);
  const [focused, setFocused] = useState({
    title: "",
  });

  useEffect(() => {
    if (!rest?.isLoading) {
      setFormDetails({
        title: data?.title,
        image: data?.image,
        description: data?.description,
      });
    }
  }, [rest?.isLoading]);

  const handleFocus = (e) => {
    setFocused({ ...focused, [e.target.id]: true });
  };

  const handleChange = (e) => {
    if (e.target.id === "image") {
      uploadImage(e, setProgress, setFormDetails, formDetails);
    } else {
      setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formDetails.image) return toast.error("Upload blog image");
    if (!formDetails.description)
      return toast.error("Blog content cannot be empty");

    try {
      const blog = await toast.promise(
        updateBlog({ ...formDetails, blogId: id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Blog updated successfully",
          error: "Unable to update blog",
        }
      );
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  return (
    <section className="box flex flex-col gap-6">
      <h2 className="font-bold text-xl">Add New Blog</h2>
      <hr />
      {rest.isLoading ? (
        <ComponentLoading />
      ) : (
        <form
          className="flex flex-col-reverse md:flex-row gap-4 mt-10 justify-around"
          onSubmit={handleSubmit}
        >
          <div className="basis-1/2 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between">
              <label
                htmlFor="title"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Blog title
              </label>
              <div className="flex flex-col basis-1/2">
                <input
                  type="text"
                  onChange={handleChange}
                  value={formDetails.title}
                  id="title"
                  name="title"
                  onBlur={handleFocus}
                  focused={focused.title.toString()}
                  pattern={"^.{5,}$"}
                  required
                  aria-required="true"
                  aria-describedby="title-error"
                  placeholder="Enter blog title"
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary"
                />
                <span
                  id="title-error"
                  className="hidden text-red-500 pl-2 text-sm mt-1"
                >
                  Title should at least 5 characters long
                </span>
              </div>
            </div>
            <hr />
            <div className="flex flex-col gap-3 justify-between">
              <label
                htmlFor="description"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Content
              </label>
              <div className="flex flex-col basis-1/2">
                <textarea
                  type="text"
                  onChange={handleChange}
                  value={formDetails.description}
                  id="description"
                  required
                  rows="10"
                  aria-required="true"
                  placeholder="Write your blog content here..."
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary w-full resize-none"
                ></textarea>
              </div>
            </div>
            <Button
              content={"Save changes"}
              type={"submit"}
              customCss={"rounded px-4 py-1 max-w-max"}
              loading={isLoading}
            />
          </div>
          <hr className="block md:hidden mt-6" />
          {/* Upload recipe image */}
          <div className="basis-1/3 rounded-xl shadow-md hover:shadow-primary hover:shadow flex justify-center items-center w-full p-8 max-h-[300px]">
            <label
              htmlFor="image"
              className="font-bold cursor-pointer flex flex-col justify-center items-center"
            >
              <div
                className={formDetails.image ? "w-[65%] mb-2" : "w-[30%] mb-6"}
              >
                {progress > 0 && progress < 100 ? (
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    color="warning"
                  />
                ) : (
                  <img
                    src={formDetails.image || photo}
                    alt="upload photo"
                    className="w-full "
                  />
                )}
              </div>
              <p className="text-center">
                Drag your image here, or
                <span className="text-primary"> browse</span>
              </p>
            </label>
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleChange}
            />
          </div>
        </form>
      )}
    </section>
  );
};

export default EditBlog;
