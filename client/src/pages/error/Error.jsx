import React from "react";
import Lottie from "lottie-react";
import { errorAnimation } from "../../assets";
import { Button } from "../../components";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section className="flex flex-col gap-4 items-center justify-center">
      <Lottie
        animationData={errorAnimation}
        loop={true}
      />
      <Link to={"/"}>
        <Button
          content={"Back to Home"}
          customCss={"max-w-max rounded-full"}
        />
      </Link>
    </section>
  );
};

export default Error;
