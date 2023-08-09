import React from "react";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../assets/index";

const Loading = () => {
  return (
    <Lottie
      animationData={loadingAnimation}
      loop={true}
    />
  );
};

export default Loading;
