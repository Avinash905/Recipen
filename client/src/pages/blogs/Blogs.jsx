import React, { useEffect } from "react";
import { AllCards } from "../../components";
import { useDispatch } from "react-redux";
import { setBlogs } from "../../features/blog/blogSlice";
import { useGetBlogsQuery } from "../../features/blog/blogApiSlice";

const Blogs = () => {
  const { data, isLoading } = useGetBlogsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      dispatch(setBlogs(data));
    }
  }, [isLoading]);

  return (
    <AllCards
      mainTitle={"Explore our Culinary Insights"}
      tagline={"Embark on a flavorful journey with our delightful blog posts!"}
      type={"blog"}
      data={data}
    />
  );
};

export default Blogs;
