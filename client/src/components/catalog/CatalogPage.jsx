import P from "prop-types";
import { useSearchParams } from "react-router-dom";
import AllCards from "../cards/AllCards";
import { useGetRecipeCatalogQuery } from "../../features/recipe/recipeApiSlice";
import { useGetBlogCatalogQuery } from "../../features/blog/blogApiSlice";
import usePageBounds from "../../hooks/usePageBounds";

export default function CatalogPage({ type, scope = "public", ...props }) {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Math.min(100000, parseInt(params.get("page"), 10) || 1));
  const query = { scope, page, limit: 12, q: params.get("q") || "", maxTime: params.get("maxTime") || "", sort: params.get("sort") || "newest" };
  const recipes = useGetRecipeCatalogQuery(query, { skip: type !== "recipe" });
  const blogs = useGetBlogCatalogQuery(query, { skip: type !== "blog" });
  const result = type === "recipe" ? recipes : blogs;
  usePageBounds(page, result.currentData, result.isFetching, setParams);
  return <AllCards {...props} type={type} canEdit={scope === "mine"} data={result.currentData?.items} serverPage={result.currentData} isFetching={result.isFetching} isError={result.isError} refetch={result.refetch} />;
}

CatalogPage.propTypes = { type: P.string.isRequired, scope: P.string };
