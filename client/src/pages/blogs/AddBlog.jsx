import React, { useState } from "react";
import { Button } from "../../components";
import { photo } from "../../assets";
import uploadImage from "../../common/uploadImage";
import { Grid, LinearProgress } from "@mui/material";
import { toast } from "react-toastify";
import { useAddBlogMutation } from "../../features/blog/blogApiSlice";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const [formDetails, setFormDetails] = useState({
    title: "",
    image: "",
    description: "",
  });
  const [progress, setProgress] = useState(0);
  const [focused, setFocused] = useState({
    title: "",
  });
  const [addBlog, { isLoading }] = useAddBlogMutation();
  const navigate = useNavigate();

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
      const blog = await toast.promise(addBlog({ ...formDetails }).unwrap(), {
        pending: "Please wait...",
        success: "Blog added successfully",
        error: "Unable to add blog",
      });
      setFormDetails({
        title: "",
        image: "",
        description: "",
      });
      navigate("/blog");
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  return (
    <section className="box flex flex-col gap-6">
      <h2 className="font-bold text-xl">Add New Blog</h2>
      <hr />
      <form
        className="flex flex-col-reverse md:flex-row gap-4 mt-10 justify-around"
        onSubmit={handleSubmit}
      >
        <div className="basis-1/2 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row justify-between">
            <label
              htmlFor="name"
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
                name="name"
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
              htmlFor="content"
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
            content={"Add blog"}
            type={"submit"}
            customCss={"rounded px-4 py-1 max-w-max"}
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
    </section>
  );
};

export default AddBlog;
