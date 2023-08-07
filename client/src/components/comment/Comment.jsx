import React from "react";
import { BsCalendarCheck } from "react-icons/bs";
import { Avatar as MuiAvatar } from "@mui/material";
import dateFormat from "../../common/dateFormat";

const Comment = ({ comment }) => {
  const formattedDate = dateFormat(comment?.date);

  return (
    <div className="border-2 border-gray-200 rounded-xl flex flex-col sm:flex-row gap-4 p-6 items-center">
      {/* Commented user details */}
      <MuiAvatar
        alt={comment?.user?.name}
        src={comment?.user?.profilePicture}
        sx={{ width: 60, height: 60 }}
        className="border-2 border-primary shadow-lg"
      />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between flex-col sm:flex-row items-center">
          <h4 className="font-bold text-lg">{comment?.user?.name}</h4>
          <span className="flex gap-2 items-center text-sm">
            <BsCalendarCheck />
            {formattedDate}
          </span>
        </div>
        {/* Comment content */}
        <p>{comment?.comment}</p>
      </div>
    </div>
  );
};

export default Comment;
