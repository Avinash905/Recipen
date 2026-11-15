import { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Logo from "../../components/logo/Logo";
import { IoMailOutline } from "react-icons/io5";
import { BiLockAlt } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../features/auth/authApiSlice";
import { toast } from "react-toastify";
import useTitle from "../../hooks/useTitle";

const SignUp = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signUp, { isLoading }] = useSignUpMutation();
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  useTitle("Recipen - Sign Up");

  const handleChange = (e) => {
    setFormError("");
    setFieldErrors((current) => ({ ...current, [e.target.id]: "" }));
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const errors = {};
    const name = formDetails.name.trim();
    if (name.length < 2 || name.length > 100) errors.name = "Enter a name between 2 and 100 characters.";
    if (formDetails.password.length < 8 || new TextEncoder().encode(formDetails.password).length > 72) errors.password = "Use at least 8 characters and at most 72 bytes.";
    setFieldErrors(errors);
    if (Object.keys(errors).length) { document.getElementById(Object.keys(errors)[0])?.focus(); return; }

    try {
      await toast.promise(
        signUp({ ...formDetails }).unwrap(),
        {
          pending: "Please wait...",
          success: "Account created",
          error: { render: ({ data: error }) => error?.data?.message || "Sign up failed" },
        }
      );
      setFormDetails({ name: "", email: "", password: "" });
      navigate("/auth/signin");
    } catch (error) {
      setFormError(error?.data?.message || "Could not create your account. Please check your connection and try again.");
    }
  };

  return (
    <section className="min-h-screen bg-[#fbf8f3] px-4 py-8 sm:px-6 lg:flex lg:items-center lg:justify-center">
      {/* Sign up form container */}
      <div className="mx-auto flex w-full max-w-md flex-col rounded-3xl border border-[#e8e1d7] bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10 lg:mx-0">
        <Logo customCss={"mx-auto"} />
        {/* Sign up form heading */}
        <div className="mt-9 mb-7 flex flex-col gap-3">
          <h1 className="text-center font-serif text-4xl text-[#29251f]">
            Create an account
          </h1>
          <p className="text-center text-sm text-[#62584b]">
            Already have an account?{" "}
            <Link
              to={"/auth/signin"}
              className="font-semibold text-[#775421] underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
        {/* Sign up form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{formError}</p>}
          <Input
            type={"text"}
            id={"name"}
            icon={<AiOutlineUser />}
            handleChange={handleChange}
            value={formDetails.name}
            label={"Full Name"}
            fieldError={fieldErrors.name}
            placeholder={"John Doe"}
            errorMessage={
              "Enter a name between 2 and 100 characters."
            }

          />
          <Input
            type={"email"}
            id={"email"}
            icon={<IoMailOutline />}
            handleChange={handleChange}
            value={formDetails.email}
            label={"Email"}
            placeholder={"example@abc.com"}
            errorMessage={"Enter a valid email address!"}

          />
          <Input
            type={"password"}
            id={"password"}
            icon={<BiLockAlt />}
            handleChange={handleChange}
            value={formDetails.password}
            label={"Password"}
            fieldError={fieldErrors.password}
            placeholder={"Password"}
            helpText={"Use at least 8 characters and at most 72 bytes. Some characters use more than one byte."}
            errorMessage={
              "Use at least 8 characters and at most 72 bytes."
            }
            pattern={".{8,}"}
          />
          <Button
            content={"Create account"}
            type={"submit"}
            customCss={"mt-3 w-full rounded-xl !bg-[#29251f] !py-3 !text-white !shadow-none"}
            loading={isLoading}
          />
        </form>
      </div>
      {/* Sign up banner image */}
      <div className="hidden lg:ml-8 lg:block lg:h-[560px] lg:w-[38%] lg:max-w-xl lg:rounded-3xl lg:bg-login lg:bg-cover lg:bg-center" role="img" aria-label="A table of food"></div>
    </section>
  );
};

export default SignUp;
