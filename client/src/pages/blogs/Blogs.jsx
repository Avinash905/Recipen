import CatalogPage from "../../components/catalog/CatalogPage";
import useTitle from "../../hooks/useTitle";

export default function Blogs() {
  useTitle("Recipen - Stories from the kitchen");
  return <CatalogPage type="blog" scope="public" mainTitle="Stories from the kitchen" tagline="Ideas, stories, and inspiration from our community." />;
}
