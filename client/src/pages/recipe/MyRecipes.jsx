import React from "react";
import { AllCards, ComponentLoading } from "../../components";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useGetRecipesQuery } from "../../features/recipe/recipeApiSlice";

const index = () => {
  const { data, isLoading } = useGetRecipesQuery();

  const userId = useSelector(selectCurrentToken)
    ? jwtDecode(useSelector(selectCurrentToken)).UserInfo.userId
    : null;

  const updatedData = data?.filter((obj) => obj.author._id === userId);

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
