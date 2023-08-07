import React, { useEffect } from "react";
import { Hero, HomeCategories, Subscribe } from "../../components";
import { useDispatch } from "react-redux";
import { setRecipes } from "../../features/recipe/recipeSlice";
import { useGetRecipesQuery } from "../../features/recipe/recipeApiSlice";
import { setBlogs } from "../../features/blog/blogSlice";
import { useGetBlogsQuery } from "../../features/blog/blogApiSlice";

const Home = () => {
  const recipes = useGetRecipesQuery();
  const blogs = useGetBlogsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setRecipes(recipes?.data));
    dispatch(setBlogs(blogs?.data));
  }, []);

  return (
    <>
      <Hero />
      <HomeCategories
        title={"recipe"}
        data={recipes?.data}
      />
      <Subscribe />
      <HomeCategories
        title={"blog"}
        data={blogs?.data}
      />
    </>
  );
};

export default Home;
