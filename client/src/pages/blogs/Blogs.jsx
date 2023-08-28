import React, { useEffect } from "react";
import { AllCards, ComponentLoading } from "../../components";
import { useDispatch } from "react-redux";
import { setBlogs } from "../../features/blog/blogSlice";
import { useGetBlogsQuery } from "../../features/blog/blogApiSlice";
import useTitle from "../../hooks/useTitle";

const Blogs = () => {
  const { data, isLoading } = useGetBlogsQuery();
  const dispatch = useDispatch();
  useTitle("Recipen - All Blogs");

  useEffect(() => {
    if (!isLoading) {
      dispatch(setBlogs(data));
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <ComponentLoading />
      ) : (
        <AllCards
          mainTitle={"Explore our Culinary Insights"}
          tagline={
            "Embark on a flavorful journey with our delightful blog posts!"
          }
          type={"blog"}
          data={data}
        />
      )}
    </>
  );
};

export default Blogs;
