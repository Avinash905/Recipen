import P from "prop-types";
import { useState } from "react";
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
  helpText,
  fieldError,
  required = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const shownError = fieldError || (focused && invalid ? errorMessage : "");

  const handleFocus = (event) => {
    setFocused(true);
    setInvalid(!event.currentTarget.validity.valid);
  };

  return (
    <div className="flex flex-col relative">
      <label
        htmlFor={id}
        className="text-sm font-semibold mb-2 text-[#433b32]"
      >
        {label}
      </label>
      <span className="absolute top-[36px] left-3 p-1 text-[#80603b]">
        {icon}
      </span>
      <input
        type={type === "password" && showPassword ? "text" : type}
        onChange={(event) => { handleChange(event); if (focused) setInvalid(!event.currentTarget.validity.valid); }}
        value={value}
        id={id}
        name={id}
        onBlur={handleFocus}
        data-data-focused={focused.toString()}
        required={required}
        aria-required={required}
        aria-invalid={shownError ? "true" : undefined}
        aria-describedby={[helpText && `${id}-help`, shownError && `${id}-error`].filter(Boolean).join(" ") || undefined}
        placeholder={placeholder}
        pattern={pattern}
        className="min-w-0 rounded-xl border border-[#d5c9b7] bg-white py-3 pl-11 pr-12 text-[#29251f] focus:outline focus:outline-2 focus:outline-[#775421]"
      />
      {type === "password" && (
        <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[36px] rounded p-1 text-lg text-[#62584b] focus:outline focus:outline-2 focus:outline-[#775421]">
          {showPassword ? <AiOutlineEyeInvisible aria-hidden="true" /> : <AiOutlineEye aria-hidden="true" />}
        </button>
      )}
      {helpText && <span id={`${id}-help`} className="mt-1 text-sm text-[#6b6257]">{helpText}</span>}
      <span
        id={`${id}-error`}
        role={shownError ? "alert" : undefined}
        className={shownError ? "text-red-500 pl-2 text-sm mt-1" : "hidden"}
      >
        {shownError}
      </span>
    </div>
  );
};

Input.propTypes = { icon: P.node, handleChange: P.func.isRequired, label: P.string.isRequired, id: P.string.isRequired, type: P.string, value: P.oneOfType([P.string, P.number]), placeholder: P.string, pattern: P.oneOfType([P.string, P.instanceOf(RegExp)]), errorMessage: P.string, helpText: P.string, fieldError: P.string, required: P.bool };

export default Input;
