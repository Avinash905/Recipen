import CatalogPage from "../../components/catalog/CatalogPage";
import useTitle from "../../hooks/useTitle";

export default function MyBlogs() {
  useTitle("Recipen - My stories");
  return <CatalogPage type="blog" scope="mine" mainTitle="My stories" tagline="Your personal story collection." createTo="/blog/add" createLabel="Write a story" />;
}
