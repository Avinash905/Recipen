import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart, AiOutlineShareAlt } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Rating } from "..";

const SingleCard = () => {
  return (
    <div className="flex flex-col gap-1 shadow hover:shadow-lg rounded">
      {/* Card Top */}
      <div className="relative overflow-hidden">
        {/* Only for recipe */}
        {/* Favorite & share button */}
        <div className="absolute top-2 right-0 flex flex-col gap-2 p-2 bg-light rounded-l-lg">
          <AiFillHeart className="text-2xl text-red-500 cursor-pointer" />
          <AiOutlineHeart className="text-2xl text-red-500 cursor-pointer" />
          <AiOutlineShareAlt className="text-2xl text-primary cursor-pointer" />
        </div>
        {/* Card image */}
        <img
          src="https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1080&dpr=1"
          alt=""
        />
        {/* Overlay */}
        <div className="absolute bottom-0 left-0 w-full backdrop-blur-sm bg-[#fffcf5d3] p-4 flex justify-between">
          <h4 className="font-bold">Jane Doe</h4>
          <span className="text-sm">20 Feb 2023</span>
        </div>
      </div>
      {/* Card Bottom details */}
      <div className="flex flex-col gap-3 p-4">
        {/* Card heading */}
        <h4 className="font-bold text-lg">Quick and Easy Weeknight Dinners</h4>
        {/* Card description */}
        <p className="text-sm">
          Welcome to the TastyConnect blog! In this edition...
        </p>
        {/* Card rating */}
        <Rating
          rating={4}
          readOnly={true}
          size={22}
        />
        {/* Read more link */}
        <Link
          to={"/blog/1"}
          className="flex gap-2 items-center mt-4 max-w-max hover:border-primary hover:text-primary"
        >
          Read more
          <BsArrowUpRight />
        </Link>
      </div>
    </div>
  );
};

export default SingleCard;
