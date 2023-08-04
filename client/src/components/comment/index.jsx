import React from "react";
import { BsCalendarCheck } from "react-icons/bs";

const index = () => {
  return (
    <div className="border-2 border-gray-200 rounded-xl flex flex-col sm:flex-row gap-4 p-6 items-center">
      {/* Commented user details */}
      <img
        src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=480&dpr=1"
        alt=""
        className="w-20 h-20 rounded-full border-2 border-primary shadow-lg"
      />
      <div className="flex flex-col gap-3">
        <div className="flex justify-between flex-col sm:flex-row items-center">
          <h4 className="font-bold text-lg">John Doe</h4>
          <span className="flex gap-2 items-center text-sm">
            <BsCalendarCheck />
            05 May 2023
          </span>
        </div>
        {/* Comment content */}
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex quam minus
          corporis porro nam sit. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Voluptate omnis laborum iste ea natus quos.
        </p>
      </div>
    </div>
  );
};

export default index;
