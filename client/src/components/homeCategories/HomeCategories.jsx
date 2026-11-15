import P from "prop-types";
import ComponentLoading from "../loading/ComponentLoading";
import SingleCard from "../cards/SingleCard";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const HomeCategories = ({ title, data, isLoading, isError, refetch }) => {
  const isRecipe = title === "recipe";
  return (
    <section className="box mt-12 md:mt-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">{isRecipe ? "From our community" : "Stories from the kitchen"}</p>
          <h2 className="mt-2 font-serif text-3xl text-[#29251f] sm:text-4xl">{isRecipe ? "Latest recipes" : "Latest stories"}</h2>
          <p className="mt-2 text-sm text-[#6b6257]">{isRecipe ? "Something delicious is waiting to be discovered." : "Ideas and inspiration from fellow food lovers."}</p>
        </div>
        <Link to={isRecipe ? "/recipe" : "/blog"} className="inline-flex items-center gap-2 text-sm font-semibold text-[#493b2b] underline underline-offset-4">Browse {isRecipe ? "recipes" : "stories"} <FiArrowRight aria-hidden="true" /></Link>
      </div>
      {isLoading ? <ComponentLoading /> : isError ? (
        <div className="rounded-xl bg-[#fbf8f3] p-6 text-center" role="alert"><p>Could not load {isRecipe ? "recipes" : "stories"}.</p><button type="button" className="mt-3 underline" onClick={refetch}>Try again</button></div>
      ) : data?.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{data.slice(0, 4).map((item) => <SingleCard key={item._id} singleData={item} type={title} />)}</div>
      ) : <p className="rounded-xl bg-[#fbf8f3] p-6 text-[#6b6257]">No {isRecipe ? "recipes" : "stories"} yet. Check back soon.</p>}
    </section>
  );
};
HomeCategories.propTypes = { title: P.string.isRequired, data: P.array, isLoading: P.bool, isError: P.bool, refetch: P.func };

export default HomeCategories;
