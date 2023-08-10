import React from "react";
import { Hero, HomeCategories, Subscribe } from "../../components";
import { useGetRecipesQuery } from "../../features/recipe/recipeApiSlice";
import { useGetBlogsQuery } from "../../features/blog/blogApiSlice";

const Home = () => {
  const recipes = useGetRecipesQuery();
  const blogs = useGetBlogsQuery();

  return (
    <>
      <Hero />
      <HomeCategories
        title={"recipe"}
        data={recipes?.data}
        isLoading={recipes?.isLoading}
      />
      <Subscribe />
      <HomeCategories
        title={"blog"}
        data={blogs?.data}
        isLoading={blogs?.isLoading}
      />
    </>
  );
};

export default Home;
