import React from "react";
import Lottie from "lottie-react";
import { Button } from "../../components";
import { Link } from "react-router-dom";

const Message = ({ animation, loop }) => {
  return (
    <section className="flex flex-col gap-4 items-center justify-center">
      <Lottie
        animationData={animation}
        loop={loop}
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

export default Message;
