import CatalogPage from "../../components/catalog/CatalogPage";
import useTitle from "../../hooks/useTitle";

export default function SavedRecipes() {
  useTitle("Recipen - Saved recipes");
  return <CatalogPage type="recipe" scope="saved" mainTitle="Saved recipes" tagline="Your favorite recipes, ready whenever you are." savedCollection />;
}
