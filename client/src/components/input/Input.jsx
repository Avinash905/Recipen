import React, { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const Input = ({
  icon,
  handleChange,
  label,
  id,
  type,
  value,
  placeholder,
  pattern,
  errorMessage,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

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
        name={id}
        onBlur={handleFocus}
        focused={focused.toString()}
        required
        aria-required="true"
        aria-describedby={`${id}-error`}
        placeholder={placeholder}
        pattern={pattern}
        className="py-1.5 px-11 border bg-gray-100 rounded-lg focus:outline outline-primary"
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
        className="hidden text-red-500 pl-2 text-sm mt-1"
      >
        {errorMessage}
      </span>
    </div>
  );
};

export default Input;
