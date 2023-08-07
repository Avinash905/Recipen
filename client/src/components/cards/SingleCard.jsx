import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart, AiOutlineShareAlt } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Rating } from "..";
import dateFormat from "../../common/dateFormat";

const SingleCard = ({ singleData, type }) => {
  const formattedDate = dateFormat(singleData?.createdAt);

  return (
    <div className="flex flex-col gap-1 justify-between shadow hover:shadow-lg rounded">
      {/* Card Top */}
      <div className="flex flex-col justify-between h-full ">
        <div className="relative h-full w-full">
          {/* Only for singleData */}
          {/* Favorite & share button */}
          {type === "recipe" && (
            <div className="absolute top-2 right-0 flex flex-col gap-2 p-2 bg-light rounded-l-lg">
              <AiFillHeart className="text-2xl text-red-500 cursor-pointer" />
              <AiOutlineHeart className="text-2xl text-red-500 cursor-pointer" />
              <AiOutlineShareAlt className="text-2xl text-primary cursor-pointer" />
            </div>
          )}
          {/* Card image */}
          <img
            src={singleData?.image}
            alt={singleData?.title}
            className="w-full object-cover object-center"
          />
          {/* Overlay */}
          <div className="absolute bottom-0 left-0 w-full backdrop-blur-sm bg-[#fffcf5d3] p-4 flex justify-between">
            <h4 className="font-bold">{singleData?.author?.name}</h4>
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>
        {/* Card Bottom details */}
        <div className="flex flex-col gap-3 p-4">
          {/* Card heading */}
          <h4 className="font-bold text-lg">{singleData?.title}</h4>
          {/* Card description */}
          <p className="text-sm">
            {singleData?.description.substring(0, 100)}...
          </p>
          {/* Card rating */}
          {type === "recipe" && (
            <Rating
              rating={4}
              readOnly={true}
              size={22}
            />
          )}
        </div>
      </div>
      {/* Read more link */}
      <Link
        to={`/${type}/${singleData?._id}`}
        className="flex gap-2 items-center p-4 mt-4 max-w-max hover:border-primary hover:text-primary"
      >
        Read more
        <BsArrowUpRight />
      </Link>
    </div>
  );
};

export default SingleCard;
