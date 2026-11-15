import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiSearch } from "react-icons/fi";

const Hero = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/recipe?q=${encodeURIComponent(value)}` : "/recipe");
  };

  return (
    <section className="box pt-5 md:pt-8">
      <div className="overflow-hidden rounded-3xl bg-[#f8f1e5] md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div className="flex flex-col items-start px-6 py-9 sm:px-10 md:py-16 lg:px-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#805b2b]">A little inspiration for every day</p>
          <h1 className="mt-5 max-w-xl font-serif text-4xl leading-[1.1] tracking-tight text-[#29251f] sm:text-5xl lg:text-6xl">Find something good to cook.</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-[#62584b]">Discover recipes from home cooks, find a new favorite, and make it your own.</p>
          <form onSubmit={handleSearch} className="mt-7 flex w-full max-w-lg gap-2">
            <label htmlFor="home-search" className="sr-only">Recipe or ingredient</label>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#d5c9b7] bg-white px-3 focus-within:outline focus-within:outline-2 focus-within:outline-[#775421]">
              <FiSearch aria-hidden="true" className="shrink-0 text-[#776d60]" />
              <input id="home-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Recipe or ingredient" className="w-full min-w-0 bg-transparent py-3.5 text-sm outline-none" />
            </div>
            <button type="submit" className="rounded-xl bg-[#29251f] px-4 py-3 font-semibold text-white hover:bg-[#494035] sm:px-6">Search</button>
          </form>
          <Link to="/recipe" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#493b2b] underline underline-offset-4">Explore all recipes <FiArrowRight aria-hidden="true" /></Link>
        </div>
        <div aria-hidden="true" className="h-44 bg-hero bg-cover bg-center sm:h-64 md:h-full md:min-h-[400px]" />
      </div>
    </section>
  );
};
export default Hero;
