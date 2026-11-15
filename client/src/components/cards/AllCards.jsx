import P from "prop-types";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import SingleCard from "./SingleCard";

const AllCards = ({ mainTitle, tagline, type, data, savedCollection = false, createTo, createLabel, canEdit = false, serverPage, isFetching = false, isError = false, refetch }) => {
  const [params, setParams] = useSearchParams();
  const itemName = type === "blog" ? "story" : "recipe";
  const itemNames = type === "blog" ? "stories" : "recipes";
  const searchTerm = params.get("q") || "";
  const query = searchTerm.trim().toLowerCase();
  const maxTime = type === "recipe" ? params.get("maxTime") || "" : "";
  const sort = params.get("sort") || "newest";
  const filteredData = serverPage ? (data || []) : (data || []).filter((item) => {
    const title = item.title?.toLowerCase() || "";
    const ingredients = type === "recipe" ? (item.ingredients || []).join(" ").toLowerCase() : "";
    const description = item.description?.toLowerCase() || "";
    const author = item.author?.name?.toLowerCase() || "";
    const matchesSearch = [title, ingredients, description, author].some((value) => value.includes(query));
    const minutes = Number(item.cookingTime);
    const matchesTime = !maxTime || (item.cookingTime != null && item.cookingTime !== "" && Number.isFinite(minutes) && minutes > 0 && minutes <= Number(maxTime));
    return matchesSearch && matchesTime;
  }).sort((a, b) => {
    if (sort === "title") return (a.title || "").localeCompare(b.title || "");
    if (sort === "time" && type === "recipe") return (Number(a.cookingTime) > 0 ? Number(a.cookingTime) : Infinity) - (Number(b.cookingTime) > 0 ? Number(b.cookingTime) : Infinity);
    return (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0);
  });
  const updateParam = (name, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value); else next.delete(name);
    next.delete("page");
    setParams(next, { replace: true });
  };
  const updatePage = (page) => { const next = new URLSearchParams(params); if (page > 1) next.set("page", String(page)); else next.delete("page"); setParams(next); };
  const hasFilters = Boolean(searchTerm || maxTime);

  return (
    <section className="box pt-6 md:pt-10">
      <div className="border-b border-[#e8e1d7] pb-7 md:flex md:items-end md:justify-between md:gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">{savedCollection ? "Your collection" : type === "recipe" ? "Find your next favorite" : "From the community"}</p>
          <h1 className="mt-3 font-serif text-4xl text-[#29251f] sm:text-5xl">{mainTitle}</h1>
          <p className="mt-3 text-[#6b6257]">{tagline}</p>
        </div>
        {createTo && <Link to={createTo} className="mt-5 inline-block rounded-full bg-[#29251f] px-5 py-3 text-sm font-semibold text-white">{createLabel}</Link>}
        <div className="mt-6 w-full md:mt-0 md:max-w-md">
          <label htmlFor="catalog-search" className="mb-2 block text-sm font-semibold text-[#433b32]">Search {itemNames}</label>
          <div className="flex items-center gap-2 rounded-xl border border-[#cfc6ba] bg-white px-4 focus-within:outline focus-within:outline-2 focus-within:outline-[#775421]">
            <FiSearch aria-hidden="true" className="shrink-0 text-[#776d60]" />
            <input id="catalog-search" type="search" maxLength={100} value={searchTerm} onChange={(e) => updateParam("q", e.target.value)} className="min-w-0 flex-1 bg-transparent py-3 outline-none" placeholder={type === "recipe" ? "Recipe or ingredient" : "Search stories"} />
            {searchTerm && <button type="button" onClick={() => updateParam("q", "")} className="text-sm font-semibold underline underline-offset-4">Clear</button>}
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-end gap-4">
        {type === "recipe" && <label className="text-sm font-semibold">Maximum cook time<select value={maxTime} onChange={(event) => updateParam("maxTime", event.target.value)} className="mt-2 block rounded-lg border border-[#cfc6ba] bg-white px-3 py-2 font-normal"><option value="">Any time</option><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option></select></label>}
        <label className="text-sm font-semibold">Sort by<select value={sort} onChange={(event) => updateParam("sort", event.target.value)} className="mt-2 block rounded-lg border border-[#cfc6ba] bg-white px-3 py-2 font-normal"><option value="newest">Newest</option><option value="title">Title</option>{type === "recipe" && <option value="time">Shortest cook time</option>}</select></label>
        {hasFilters && filteredData.length > 0 && <button type="button" onClick={() => { const next = new URLSearchParams(params); next.delete("q"); next.delete("maxTime"); next.delete("page"); setParams(next, { replace: true }); }} className="rounded-lg px-2 py-2 text-sm font-semibold underline">Clear filters</button>}
      </div>
      <div className="py-7" aria-live="polite"><p className="text-sm font-semibold text-[#62584b]">{isFetching ? "Loading results..." : isError ? "" : `${serverPage?.total ?? filteredData.length} ${(serverPage?.total ?? filteredData.length) === 1 ? itemName : itemNames}${hasFilters ? " found" : ""}`}</p></div>
      {isError ? <div role="alert" className="rounded-xl bg-[#fbf8f3] p-6">Could not load results. <button type="button" onClick={refetch} className="underline">Try again</button></div> : isFetching && !serverPage ? null : filteredData.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filteredData.map((item) => <SingleCard key={item._id} singleData={item} type={type} canEdit={canEdit} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e8e1d7] bg-[#fbf8f3] px-6 py-14 text-center">
          <h2 className="break-words font-serif text-2xl [overflow-wrap:anywhere]">{serverPage?.total > 0 && serverPage.page > 1 ? "No results on this page" : savedCollection && !hasFilters ? "No saved recipes yet" : createTo && !hasFilters ? `You have not created a ${itemName} yet` : `No ${itemNames} found${searchTerm ? ` for “${searchTerm}”` : ""}`}</h2>
          <p className="mt-2 text-[#6b6257]">{hasFilters ? "Try different filters or browse everything." : savedCollection ? "Save a recipe to keep it here for later." : createTo ? "Create your first one to see it here." : "Check back soon for new additions."}</p>
          {hasFilters ? <button type="button" className="mt-5 font-semibold underline underline-offset-4" onClick={() => { const next = new URLSearchParams(params); next.delete("q"); next.delete("maxTime"); next.delete("page"); setParams(next, { replace: true }); }}>Clear filters</button> : createTo ? <Link to={createTo} className="mt-5 inline-block font-semibold underline underline-offset-4">{createLabel}</Link> : savedCollection && <Link to="/recipe" className="mt-5 inline-block font-semibold underline underline-offset-4">Browse recipes</Link>}
        </div>
      )}
      {serverPage && serverPage.total > 0 && <nav aria-label={`${itemName} pages`} className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm"><button type="button" disabled={serverPage.page <= 1 || isFetching} onClick={() => updatePage(serverPage.page - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button><span>Page {serverPage.page} of {Math.max(1, Math.ceil(serverPage.total / serverPage.limit))}</span><button type="button" disabled={serverPage.page * serverPage.limit >= serverPage.total || isFetching} onClick={() => updatePage(serverPage.page + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button></nav>}
    </section>
  );
};
AllCards.propTypes = { mainTitle: P.string, tagline: P.string, type: P.string.isRequired, data: P.array, savedCollection: P.bool, createTo: P.string, createLabel: P.string, canEdit: P.bool, serverPage: P.shape({ total: P.number, page: P.number, limit: P.number }), isFetching: P.bool, isError: P.bool, refetch: P.func };

export default AllCards;
