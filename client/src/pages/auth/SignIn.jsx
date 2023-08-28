import React, { useState } from "react";
import { Button, Input, Logo } from "../../components";
import { IoMailOutline } from "react-icons/io5";
import { BiLockAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import useTitle from "../../hooks/useTitle";

const SignIn = () => {
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });
  const [signIn, { isLoading }] = useSignInMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useTitle("Recipen - Sign In");

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await toast.promise(
        signIn({ ...formDetails }).unwrap(),
        {
          pending: "Please wait...",
          success: "Sign in successfull",
          error: "Sign in failed",
        }
      );
      dispatch(setCredentials({ ...userData }));
      localStorage.setItem("persist", true);
      setFormDetails({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  return (
    <section className="flex w-full h-screen">
      {/* Sign in form container */}
      <div className="basis-1/4 m-auto flex flex-col">
        <Logo customCss={"mx-auto md:mx-0"} />
        {/* Sign in form heading */}
        <div className="mt-12 mb-6 flex flex-col gap-3">
          <h2 className="text-center md:text-left font-bold text-3xl">
            Welcome back
          </h2>
          <p className="text-center md:text-left text-sm">
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
          onSubmit={handleSubmit}
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
            loading={isLoading}
          />
        </form>
      </div>
      {/* Sign in banner image */}
      <div className="hidden md:block basis-1/2 bg-login bg-no-repeat bg-cover bg-center"></div>
    </section>
  );
};

export default SignIn;
