import React from "react";
import { AllCards } from "../../components";

const index = () => {
  return (
    <AllCards
      mainTitle={"Discover Flavorful Creations"}
      tagline={
        "Delight in a diverse collection of mouthwatering recipes, curated and shared by passionate food enthusiasts."
      }
      type={"recipes"}
    />
  );
};

export default index;
