import CatalogPage from "../../components/catalog/CatalogPage";
import useTitle from "../../hooks/useTitle";

export default function Recipe() {
  useTitle("Recipen - Explore recipes");
  return <CatalogPage type="recipe" scope="public" mainTitle="Explore recipes" tagline="Find a dish to cook today." />;
}
