import React, { useState } from "react";
import { Button, Input, Logo } from "../../components";
import { IoMailOutline } from "react-icons/io5";
import { BiLockAlt } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleLogin = () => {};

  return (
    <section className="flex w-full h-screen">
      {/* Sign up form container */}
      <div className="basis-1/4 m-auto flex flex-col">
        <Logo />
        {/* Sign up form heading */}
        <div className="mt-12 mb-6 flex flex-col gap-3">
          <h2 className="font-bold text-3xl">Create an account</h2>
          <p className="text-sm">
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
          onSubmit={handleLogin}
        >
          <Input
            type={"text"}
            id={"name"}
            icon={<AiOutlineUser />}
            handleChange={handleChange}
            value={formDetails.name}
            label={"Full Name"}
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
          <Input
            type={"password"}
            id={"password"}
            icon={<BiLockAlt />}
            handleChange={handleChange}
            value={formDetails.password}
            label={"Password"}
            placeholder={"At least 6 characters long"}
          />
          <Button
            content={"Sign in"}
            type={"submit"}
            customCss={"mt-3 rounded-lg"}
          />
        </form>
        <div className="flex gap-4 mt-8 items-center">
          <div className="w-full h-[1px] bg-gray-200"></div>
          <p className="text-gray-500">or</p>
          <div className="w-full h-[1px] bg-gray-200"></div>
        </div>
        {/* Sign up with google */}
        {/* <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        /> */}
      </div>
      {/* Sign up banner image */}
      <div className="hidden md:block basis-1/2 bg-login bg-no-repeat bg-cover bg-center"></div>
    </section>
  );
};

export default SignUp;
