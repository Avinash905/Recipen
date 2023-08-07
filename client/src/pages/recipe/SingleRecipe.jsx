import React, { useState } from "react";
import { Comment, Rating, Button, Input } from "../../components";
import { IoMailOutline } from "react-icons/io5";
import { FaRegPaperPlane } from "react-icons/fa";
import { LuChefHat } from "react-icons/lu";
import { BsStopwatch } from "react-icons/bs";
import { LiaWeightSolid } from "react-icons/lia";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShareAlt,
  AiOutlineUser,
} from "react-icons/ai";
import { useGetRecipeQuery } from "../../features/recipe/recipeApiSlice";
import { useParams } from "react-router-dom";

const SingleRecipe = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { id } = useParams();
  const { data, isLoading } = useGetRecipeQuery(id);

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleLogin = () => {};

  return (
    <section className="box flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Recipe image */}
        <div className="basis-1/3">
          <img
            src={data?.image}
            alt={data?.title}
            className="rounded w-full"
          />
        </div>
        {/* Recipe details */}
        <div className="basis-2/3 flex flex-col gap-2">
          <h2 className="font-bold text-xl md:text-3xl">{data?.title}</h2>
          <div className="flex justify-between items-center">
            <p className="flex gap-2 items-center font-semibold">
              <LuChefHat className="text-primary" />
              {data?.author?.name}
            </p>
            <div className="flex gap-2 p-2 bg-light rounded-l-lg">
              <AiFillHeart className="text-2xl text-red-500 cursor-pointer" />
              <AiOutlineHeart className="text-2xl text-red-500 cursor-pointer" />
              <AiOutlineShareAlt className="text-2xl cursor-pointer" />
            </div>
          </div>
          {/* Recipe rating */}
          <Rating
            rating={4}
            readOnly={true}
          />
          <p className="my-4">{data?.description}</p>
          {/* Recipe time & cals */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between w-2/3 mx-auto">
            <div className="flex flex-col gap-1 items-center">
              <BsStopwatch className="text-5xl text-gray-800" />
              <h3 className="font-bold text-xl text-primary">Cooking Time</h3>
              <p>{data?.cookingTime} minutes</p>
            </div>
            <div className="flex flex-col gap-1 items-center text-gray-800">
              <LiaWeightSolid className="text-5xl" />
              <h3 className="font-bold text-xl text-primary">Calories</h3>
              <p>{data?.calories} cal</p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-col md:flex-row gap-4">
        {/* Recipe Ingredients */}
        <div className="basis-1/3 flex flex-col gap-4 border-b-2 md:border-b-0 pb-4 md:pb-0 md:border-r-2 border-gray-200 items-center">
          <h3 className="font-bold text-2xl">Ingredients</h3>
          <ol className="flex flex-col gap-2 list-decimal ml-5">
            {data?.ingredients?.map((ingredient, i) => (
              <li key={`ingredient-${i + 1}`}>{ingredient}</li>
            ))}
          </ol>
        </div>
        {/* Recipe Instructions */}
        <div className="basis-2/3 flex flex-col gap-4">
          <h3 className="font-bold text-2xl">Instructions</h3>
          <ul className="ml-2 flex flex-col gap-4">
            {data?.instructions?.map((instruction, i) => (
              <li key={`instruction-${i + 1}`}>
                <h4 className="font-bold text-xl">Step {i + 1}</h4>
                <p className="ml-2">{instruction}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <hr />
      {/* Rate recipe */}
      <div className="my-6 w-full sm:w-2/3 md:w-1/2 mx-auto flex justify-between gap-6">
        <h3 className="font-bold text-2xl">Rate the recipe</h3>
        <Rating
          readOnly={false}
          size={35}
        />
      </div>
      <hr />
      {/* Recipe write comment */}
      <div className="my-10 w-full sm:w-2/3 md:w-1/2 mx-auto flex flex-col gap-6">
        <h3 className="font-bold text-2xl">Leave a Reply</h3>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleLogin}
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
          />
        </form>
      </div>
      <hr />
      {/* Recipe comments */}
      <div className="w-full sm:w-4/5 mx-auto flex flex-col gap-6">
        <h3 className="font-bold text-2xl">Comments</h3>
        <div className="flex flex-col gap-6">
          {data?.comments?.map((comment) => (
            <Comment
              key={comment?._id}
              comment={comment}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SingleRecipe;
