import React from "react";
import { AllCards, ComponentLoading } from "../../components";
import { useGetRecipesQuery } from "../../features/recipe/recipeApiSlice";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const index = () => {
  const { data, isLoading } = useGetRecipesQuery();
  const user = useAuth();
  useTitle("Recipen - My Recipes");

  const updatedData = data?.filter((obj) => obj.author._id === user?.userId);

  return (
    <>
      {isLoading ? (
        <ComponentLoading />
      ) : (
        <AllCards
          mainTitle={"Your Original Creations"}
          tagline={
            "Welcome to your dedicated space where your imagination takes the lead."
          }
          type={"recipe"}
          data={updatedData}
        />
      )}
    </>
  );
};

export default index;
