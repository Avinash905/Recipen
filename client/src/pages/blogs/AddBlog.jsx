import React, { useState } from "react";
import { Button } from "../../components";
import { photo } from "../../assets";

const AddBlog = () => {
  const [formDetails, setFormDetails] = useState({
    title: "",
    image: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => {};

  const handleImageUpload = () => {};

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
                required
                aria-required="true"
                aria-describedby="title-error"
                placeholder="Enter recipe title"
                className="p-1.5 border-red-500 border bg-gray-100 rounded focus:outline outline-primary"
              />
              <span
                id="title-error"
                className="text-red-500 pl-2 text-sm mt-1"
              >
                Invalid email
              </span>
            </div>
          </div>
          <hr />
          <div className="flex flex-col gap-3 justify-between">
            <label
              htmlFor="ingredient"
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
                aria-describedby="description-error"
                placeholder="Write your steps here..."
                className="p-1.5 border-red-500 border bg-gray-100 rounded focus:outline outline-primary w-full resize-none"
              ></textarea>
              <span
                id="description-error"
                className="text-red-500 pl-2 text-sm mt-1 mb-3"
              >
                Invalid email
              </span>
            </div>
          </div>
          <Button
            content={"Save changes"}
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
            <div className="w-[30%] mb-6">
              <img
                src={photo}
                alt="upload photo"
              />
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
            value={formDetails.image}
            onChange={handleImageUpload}
          />
        </div>
      </form>
    </section>
  );
};

export default AddBlog;
