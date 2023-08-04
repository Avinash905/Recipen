import React, { useState } from "react";
import { Button, Input, Logo } from "../../components";
import { IoMailOutline } from "react-icons/io5";
import { BiLockAlt } from "react-icons/bi";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleLogin = () => {};

  return (
    <section className="flex w-full h-screen">
      {/* Sign in form container */}
      <div className="basis-1/4 m-auto flex flex-col">
        <Logo />
        {/* Sign in form heading */}
        <div className="mt-12 mb-6 flex flex-col gap-3">
          <h2 className="font-bold text-3xl">Welcome back</h2>
          <p className="text-sm">
            New to Recipen?{" "}
            <Link
              to={"/auth/signup"}
              className="text-primary font-semibold"
            >
              Create an account
            </Link>
          </p>
        </div>
        {/* Sign in form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleLogin}
        >
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
            customCss={"mt-5 rounded-lg"}
          />
        </form>
        <div className="flex gap-4 mt-8 items-center">
          <div className="w-full h-[1px] bg-gray-200"></div>
          <p className="text-gray-500">or</p>
          <div className="w-full h-[1px] bg-gray-200"></div>
        </div>
        {/* Sign in with google */}
        {/* <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        /> */}
      </div>
      {/* Sign in banner image */}
      <div className="hidden md:block basis-1/2 bg-login bg-no-repeat bg-cover bg-center"></div>
    </section>
  );
};

export default SignIn;
