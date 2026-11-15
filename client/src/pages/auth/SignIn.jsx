import { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Logo from "../../components/logo/Logo";
import { IoMailOutline } from "react-icons/io5";
import { BiLockAlt } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import useTitle from "../../hooks/useTitle";
import { apiSlice } from "../../redux/apiSlice";

const SignIn = () => {
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [signIn, { isLoading }] = useSignInMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useTitle("Recipen - Sign In");

  const handleChange = (e) => {
    setFormError("");
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const userData = await signIn({ ...formDetails }).unwrap();
      toast.success("Sign in successful");
      dispatch(apiSlice.util.resetApiState());
      dispatch(setCredentials({ ...userData }));
      localStorage.setItem("persist", true);
      setFormDetails({ email: "", password: "" });
      const from = location.state?.from;
      navigate(from?.pathname ? `${from.pathname}${from.search || ""}${from.hash || ""}` : "/", { replace: true });
    } catch (error) {
      setFormError(error?.status === 401 ? "Email or password is incorrect." : error?.data?.message || "Sign in failed. Check your details and try again.");
    }
  };

  return (
    <section className="min-h-screen bg-[#fbf8f3] px-4 py-8 sm:px-6 lg:flex lg:items-center lg:justify-center">
      {/* Sign in form container */}
      <div className="mx-auto flex w-full max-w-md flex-col rounded-3xl border border-[#e8e1d7] bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10 lg:mx-0">
        <Logo customCss={"mx-auto"} />
        {/* Sign in form heading */}
        <div className="mt-9 mb-7 flex flex-col gap-3">
          <h1 className="text-center font-serif text-4xl text-[#29251f]">
            Welcome back
          </h1>
          <p className="text-center text-sm text-[#62584b]">
            New to Recipen?{" "}
            <Link
              to={"/auth/signup"}
              className="font-semibold text-[#775421] underline underline-offset-4"
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
          {location.state?.reason && <p className="rounded-xl bg-[#f8f3eb] p-3 text-sm text-[#493b2b]">{location.state.reason}</p>}
          {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{formError}</p>}
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
            placeholder={"Enter your password"}
          />
          <Button
            content={"Sign in"}
            type={"submit"}
            customCss={"mt-5 w-full rounded-xl !bg-[#29251f] !py-3 !text-white !shadow-none"}
            loading={isLoading}
          />
        </form>
      </div>
      {/* Sign in banner image */}
      <div className="hidden lg:ml-8 lg:block lg:h-[560px] lg:w-[38%] lg:max-w-xl lg:rounded-3xl lg:bg-login lg:bg-cover lg:bg-center" role="img" aria-label="A table of food"></div>
    </section>
  );
};

export default SignIn;
