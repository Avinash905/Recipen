import React from "react";
import { AllCards } from "../../components";

const index = () => {
  return (
    <AllCards
      mainTitle={"Your Flavorful Collection"}
      tagline={
        "Welcome to your personal culinary treasury - a haven for your favorite recipes!"
      }
      type={"recipes"}
    />
  );
};

export default index;
