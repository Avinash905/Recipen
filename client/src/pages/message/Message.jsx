import P from "prop-types";
import Lottie from "lottie-react";
import Button from "../../components/button/Button";
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

Message.propTypes = { animation: P.object, loop: P.bool };

export default Message;
