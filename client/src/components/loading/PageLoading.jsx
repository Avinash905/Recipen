import React from "react";
import Lottie from "lottie-react";
import { pageLoading } from "../../assets/index";

const PageLoading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Lottie
        animationData={pageLoading}
        loop={true}
        className="w-80 h-80"
      />
    </div>
  );
};

export default PageLoading;
