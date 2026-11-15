import Hero from "../../components/hero/Hero";
import HomeCategories from "../../components/homeCategories/HomeCategories";
import { useGetRecipeCatalogQuery } from "../../features/recipe/recipeApiSlice";
import { useGetBlogCatalogQuery } from "../../features/blog/blogApiSlice";

const Home = () => {
  const recipes = useGetRecipeCatalogQuery({ page: 1, limit: 4 });
  const blogs = useGetBlogCatalogQuery({ page: 1, limit: 4 });

  return (
    <>
      <Hero />
      <HomeCategories
        title={"recipe"}
        data={recipes?.data?.items}
        isLoading={recipes?.isLoading}
        isError={recipes?.isError}
        refetch={recipes?.refetch}
      />
      <HomeCategories
        title={"blog"}
        data={blogs?.data?.items}
        isLoading={blogs?.isLoading}
        isError={blogs?.isError}
        refetch={blogs?.refetch}
      />
    </>
  );
};

export default Home;
