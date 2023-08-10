import React from "react";
import { AllCards, ComponentLoading } from "../../components";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useGetRecipesQuery } from "../../features/recipe/recipeApiSlice";

const index = () => {
  const { data, isLoading } = useGetRecipesQuery();

  const favorites = useSelector(selectCurrentToken)
    ? jwtDecode(useSelector(selectCurrentToken)).UserInfo.favorites
    : null;

  const updatedData = data?.filter((obj) =>
    favorites?.includes(obj._id.toString())
  );

  return (
    <>
      {isLoading ? (
        <ComponentLoading />
      ) : (
        <AllCards
          mainTitle={"Your Flavorful Collection"}
          tagline={
            "Welcome to your personal culinary treasury - a haven for your favorite recipes!"
          }
          type={"recipe"}
          data={updatedData}
        />
      )}
    </>
  );
};

export default index;
