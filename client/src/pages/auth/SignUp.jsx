import React, { useState } from "react";
import { Button, Input, Logo } from "../../components";
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
  const navigate = useNavigate();
  useTitle("Recipen - Sign Up");

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await toast.promise(
        signUp({ ...formDetails }).unwrap(),
        {
          pending: "Please wait...",
          success: "Sign up successfull",
          error: "Sign up failed",
        }
      );
      setFormDetails({ name: "", email: "", password: "" });
      navigate("/auth/signin");
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  return (
    <section className="flex w-full h-screen">
      {/* Sign up form container */}
      <div className="basis-1/4 m-auto flex flex-col">
        <Logo customCss={"mx-auto md:mx-0"} />
        {/* Sign up form heading */}
        <div className="mt-12 mb-6 flex flex-col gap-3">
          <h2 className="text-center md:text-left font-bold text-3xl">
            Create an account
          </h2>
          <p className="text-center md:text-left text-sm">
            Already have an account?{" "}
            <Link
              to={"/auth/signin"}
              className="text-primary font-semibold"
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
          <Input
            type={"text"}
            id={"name"}
            icon={<AiOutlineUser />}
            handleChange={handleChange}
            value={formDetails.name}
            label={"Full Name"}
            placeholder={"John Doe"}
            errorMessage={
              "Name should be more than 3 characters long and should not include special characters!"
            }
            pattern={"^[a-zA-Z]{3,}(?: [a-zA-Z]{3,})*$"}
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
            pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/}
          />
          <Input
            type={"password"}
            id={"password"}
            icon={<BiLockAlt />}
            handleChange={handleChange}
            value={formDetails.password}
            label={"Password"}
            placeholder={"At least 6 characters long"}
            errorMessage={
              "Password should be 6-15 characters long and must include at least 1 letter, 1 number and 1 special character!"
            }
            pattern={`^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$`}
          />
          <Button
            content={"Sign in"}
            type={"submit"}
            customCss={"mt-3 rounded-lg"}
            loading={isLoading}
          />
        </form>
      </div>
      {/* Sign up banner image */}
      <div className="hidden md:block basis-1/2 bg-login bg-no-repeat bg-cover bg-center"></div>
    </section>
  );
};

export default SignUp;
