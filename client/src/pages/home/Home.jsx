import React from "react";
import { Hero, HomeCategories, Subscribe } from "../../components";
import { useGetRecipesQuery } from "../../features/recipe/recipeApiSlice";
import { useGetBlogsQuery } from "../../features/blog/blogApiSlice";
import useAuth from "../../hooks/useAuth";

const Home = () => {
  const user = useAuth();
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
      {!user?.roles?.some((role) => role === "ProUser" || role === "Admin") && (
        <Subscribe />
      )}
      <HomeCategories
        title={"blog"}
        data={blogs?.data}
        isLoading={blogs?.isLoading}
      />
    </>
  );
};

export default Home;
