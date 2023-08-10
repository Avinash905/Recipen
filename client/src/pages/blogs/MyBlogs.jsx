import React from "react";
import { AllCards, ComponentLoading } from "../../components";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useGetBlogsQuery } from "../../features/blog/blogApiSlice";

const index = () => {
  const { data, isLoading } = useGetBlogsQuery();

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
          mainTitle={"Your Recipen Chronicles"}
          tagline={
            "Dive into a world of your engaging articles and captivating stories on Recipen Chronicles."
          }
          type={"blog"}
          data={updatedData}
        />
      )}
    </>
  );
};

export default index;
