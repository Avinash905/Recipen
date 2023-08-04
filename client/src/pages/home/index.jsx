import React from "react";
import { Hero, HomeCategories, Subscribe } from "../../components";

const index = () => {
  return (
    <>
      <Hero />
      <HomeCategories title={"Latest Recipes"} />
      <Subscribe />
      <HomeCategories title={"Latest Blogs"} />
    </>
  );
};

export default index;
