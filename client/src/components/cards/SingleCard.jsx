import P from "prop-types";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiClock } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useToggleFavoriteMutation } from "../../features/recipe/recipeApiSlice";
import { setCredentials, sameSession } from "../../features/auth/authSlice";
import { useDispatch, useStore } from "react-redux";
import useAuth from "../../hooks/useAuth";

const SingleCard = ({ singleData, type, canEdit = false }) => {
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const store = useStore();
  const [imageFailed, setImageFailed] = useState(false);
  const [toggleFavorite, { isLoading: isSaving }] = useToggleFavoriteMutation();
  const isRecipe = type === "recipe";
  const returnTo = [ `/${type}`, `/${type}/my-${type === "recipe" ? "recipes" : "blogs"}`, ...(isRecipe ? ["/recipe/saved"] : []) ].includes(location.pathname) ? `${location.pathname}${location.search}` : `/${type}`;
  const destination = `/${type}/${singleData._id}`;
  const saved = Boolean(user?.favorites?.includes(singleData._id));
  const ratings = singleData.ratings || [];
  const ratingCount = singleData.ratingCount ?? ratings.length;
  const average = singleData.ratingAverage ?? (ratings.length ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : 0);
  const description = (singleData.description || "").trim();
  const date = new Date(singleData.createdAt);
  const formattedDate = Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date);

  const handleToggleFavorite = async () => {
    try {
      if (!user) {
        toast.error("You must sign in first");
        return navigate("/auth/signin", { state: { from: location } });
      }
      const startingToken = store.getState().auth.token;
      const userData = await toast.promise(toggleFavorite({ recipeId: singleData._id, saved: !saved }).unwrap(), {
        pending: "Please wait...", success: "Favorites updated", error: "Unable to update favorites",
      });
      if (sameSession(store.getState().auth.token, startingToken)) dispatch(setCredentials({ ...userData }));
    } catch (error) { console.error(error); }
  };

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white transition-shadow hover:shadow-lg">
      <div className={`relative overflow-hidden bg-[#f2ece2] ${isRecipe ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
        <Link to={destination} state={{ returnTo }} aria-label={`View ${singleData.title}`} className="block h-full w-full">
          {singleData.image && !imageFailed ? <img src={singleData.image} alt="" loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" /> : <span className="flex h-full items-center justify-center px-4 text-center font-serif text-xl text-[#62584b]">{isRecipe ? "Recipe photo unavailable" : "Story photo unavailable"}</span>}
        </Link>
        {isRecipe && <button type="button" aria-label={saved ? `Remove ${singleData.title} from saved recipes` : `Save ${singleData.title}`} aria-pressed={saved} disabled={isSaving} onClick={handleToggleFavorite} className="absolute right-3 top-3 rounded-full bg-white p-2.5 text-xl text-[#9f3629] shadow-sm hover:bg-[#fff8f4] disabled:opacity-50">{saved ? <AiFillHeart aria-hidden="true" /> : <AiOutlineHeart aria-hidden="true" />}</button>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#6b6257]">{isRecipe ? "By " : "Story by "}{singleData.author?.name || "Recipen community"}</p>
        <h2 className="mt-2 break-words font-serif text-2xl leading-tight text-[#29251f]"><Link className="hover:underline" to={destination} state={{ returnTo }}>{singleData.title}</Link></h2>
        {canEdit && <Link to={`/${type}/edit/${singleData._id}`} aria-label={`Edit ${singleData.title}`} className="mt-3 w-fit text-sm font-semibold underline underline-offset-4">Edit</Link>}
        {description && (isRecipe ? <p className="mt-3 text-sm leading-6 text-[#6b6257]">{description.length > 120 ? `${description.slice(0, 120).trim()}…` : description}</p> : <div className="story-excerpt mt-3 text-sm leading-6 text-[#6b6257]"><ReactMarkdown components={{ a: ({ children }) => <span>{children}</span>, img: () => null }}>{description}</ReactMarkdown></div>)}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f0ebe4] pt-4 text-sm text-[#62584b]">
          {isRecipe ? <>{singleData.cookingTime && <span className="inline-flex items-center gap-1.5"><FiClock aria-hidden="true" /> {singleData.cookingTime} min cook</span>}<span>{ratingCount ? `★ ${average.toFixed(1)} (${ratingCount})` : "Not rated yet"}</span></> : <span>{formattedDate}</span>}

        </div>
      </div>
    </article>
  );
};
SingleCard.propTypes = { type: P.string.isRequired, canEdit: P.bool, singleData: P.shape({ _id: P.string, title: P.string, image: P.string, description: P.string, createdAt: P.string, cookingTime: P.oneOfType([P.string, P.number]), ratings: P.array, ratingCount: P.number, ratingAverage: P.number, author: P.shape({ name: P.string }) }).isRequired };

export default SingleCard;
