import CatalogPage from "../../components/catalog/CatalogPage";
import useTitle from "../../hooks/useTitle";

export default function MyRecipes() {
  useTitle("Recipen - My recipes");
  return <CatalogPage type="recipe" scope="mine" mainTitle="My recipes" tagline="Your personal recipe collection." createTo="/recipe/add" createLabel="Add recipe" />;
}
