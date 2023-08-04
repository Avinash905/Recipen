import React, { useState } from "react";
import { Button } from "../../components";
import { photo } from "../../assets";
import { RxCross2 } from "react-icons/rx";

const AddRecipe = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    image: "",
    description: "",
    calories: "",
    cookingTime: "",
    ingredients: [],
    instructions: [],
  });
  const [ingredient, setIngredient] = useState("");
  const [instruction, setInstruction] = useState("");

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => {};

  const handleImageUpload = () => {};

  return (
    <section className="box flex flex-col gap-6">
      <h2 className="font-bold text-xl">Add New Recipe</h2>
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
              Recipe name
            </label>
            <div className="flex flex-col basis-1/2">
              <input
                type="text"
                onChange={handleChange}
                value={formDetails.name}
                id="name"
                required
                aria-required="true"
                aria-describedby="name-error"
                placeholder="Enter recipe name"
                className="p-1.5 border-red-500 border bg-gray-100 rounded focus:outline outline-primary"
              />
              <span
                id="name-error"
                className="text-red-500 pl-2 text-sm mt-1"
              >
                Invalid email
              </span>
            </div>
          </div>
          <hr />
          <div className="flex flex-col sm:flex-row justify-between">
            <label
              htmlFor="calories"
              className="text-sm font-semibold mb-3 basis-1/2"
            >
              Total calories
            </label>
            <div className="flex flex-col basis-1/2">
              <input
                type="number"
                onChange={handleChange}
                value={formDetails.calories}
                id="calories"
                required
                aria-required="true"
                aria-describedby="calories-error"
                placeholder="Enter total calories"
                className="p-1.5 border-red-500 border bg-gray-100 rounded focus:outline outline-primary"
              />
              <span
                id="calories-error"
                className="text-red-500 pl-2 text-sm mt-1"
              >
                Invalid email
              </span>
            </div>
          </div>
          <hr />
          <div className="flex flex-col sm:flex-row justify-between">
            <label
              htmlFor="cookingTime"
              className="text-sm font-semibold mb-3 basis-1/2"
            >
              Cooking time
            </label>
            <div className="flex flex-col basis-1/2">
              <input
                type="number"
                onChange={handleChange}
                value={formDetails.cookingTime}
                id="cookingTime"
                required
                aria-required="true"
                aria-describedby="cookingTime-error"
                placeholder="Total cooking time in mins."
                className="p-1.5 border-red-500 border bg-gray-100 rounded focus:outline outline-primary"
              />
              <span
                id="cookingTime-error"
                className="text-red-500 pl-2 text-sm mt-1"
              >
                Invalid email
              </span>
            </div>
          </div>
          <hr />
          <div className="flex flex-col sm:flex-row justify-between">
            <label
              htmlFor="ingredient"
              className="text-sm font-semibold mb-3 basis-1/2"
            >
              Add ingredients
            </label>
            <div className="flex flex-col basis-1/2">
              <div className="flex flex-col">
                <div className="flex gap-1 justify-between">
                  <input
                    type="text"
                    onChange={(e) => setIngredient(e.target.value)}
                    value={ingredient}
                    id="ingredient"
                    required
                    aria-required="true"
                    aria-describedby="ingredient-error"
                    placeholder="2 medium onion"
                    className="p-1.5 border-red-500 border bg-gray-100 rounded focus:outline outline-primary w-full"
                  />
                  <Button
                    content={"Add"}
                    customCss={"rounded text-sm px-4 py-1"}
                  />
                </div>
                <span
                  id="ingredient-error"
                  className="text-red-500 pl-2 text-sm mt-1 mb-3"
                >
                  Invalid email
                </span>
                <ul className="flex flex-col gap-2">
                  <li className="flex justify-between items-center shadow hover:shadow-md rounded p-2 gap-2">
                    2 medium onions
                    <RxCross2 className="cursor-pointer" />
                  </li>
                  <li className="flex justify-between items-center shadow hover:shadow-md rounded p-2 gap-2">
                    2 medium onions
                    <RxCross2 className="cursor-pointer" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr />
          <div className="flex flex-col gap-4 justify-between">
            <div className="flex gap-1 justify-between items-center">
              <label
                htmlFor="ingredient"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Add Steps
              </label>
              <Button
                content={"Add"}
                customCss={"rounded text-sm px-4 py-1"}
              />
            </div>
            <div className="flex flex-col basis-1/2">
              <textarea
                type="text"
                onChange={(e) => setInstruction(e.target.value)}
                value={instruction}
                id="instruction"
                required
                rows="7"
                aria-required="true"
                aria-describedby="instruction-error"
                placeholder="Write your steps here..."
                className="p-1.5 border-red-500 border bg-gray-100 rounded focus:outline outline-primary w-full resize-none"
              ></textarea>
              <span
                id="instruction-error"
                className="text-red-500 pl-2 text-sm mt-1 mb-3"
              >
                Invalid email
              </span>
              {/* All added instructions */}
              <ul className="flex flex-col gap-2">
                <li className="flex justify-between items-start gap-4 shadow hover:shadow-md rounded p-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Molestiae cum excepturi quae, dolorem suscipit quas nam amet
                  blanditiis officia vitae quisquam modi necessitatibus
                  reiciendis asperiores ut voluptates vero autem quo.
                  <RxCross2 className="cursor-pointer text-5xl" />
                </li>
              </ul>
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

export default AddRecipe;
