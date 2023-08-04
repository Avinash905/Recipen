import React, { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const index = ({ type, id, icon, handleChange, value, label, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col relative">
      <label
        htmlFor={id}
        className="text-sm font-semibold mb-3"
      >
        {label}
      </label>
      <span className="absolute top-[39px] left-3 bg-light p-1 rounded text-primary">
        {icon}
      </span>
      <input
        type={type === "password" && showPassword ? "text" : type}
        onChange={handleChange}
        value={value}
        id={id}
        required
        aria-required="true"
        aria-describedby={`${id}-error`}
        placeholder={placeholder}
        className="py-1.5 px-11 border-red-500 border bg-gray-100 rounded-lg focus:outline outline-primary"
      />
      {type === "password" && (
        <>
          {showPassword && (
            <AiOutlineEyeInvisible
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[42px] right-3 cursor-pointer text-gray-700 text-lg"
            />
          )}
          {!showPassword && (
            <AiOutlineEye
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[42px] right-3 cursor-pointer text-gray-700 text-lg"
            />
          )}
        </>
      )}
      <span
        id={`${id}-error`}
        className="text-red-500 pl-2 text-sm mt-1"
      >
        Invalid email
      </span>
    </div>
  );
};

export default index;
