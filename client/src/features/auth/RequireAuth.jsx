import P from "prop-types";
import { useLocation, Navigate, Outlet, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import PageLoading from "../../components/loading/PageLoading";
import useTitle from "../../hooks/useTitle";
import { useContext } from "react";
import { RestoreContext } from "./RestoreContext";

const AccessUnavailable = () => {
  useTitle("Recipen - Access unavailable");
  return <section className="box py-12 text-center">
    <h1 className="text-2xl font-bold">Access unavailable</h1>
    <p className="mt-3 text-gray-600">Your account does not have access to this page.</p>
    <Link to="/" className="mt-4 inline-block underline">Return home</Link>
  </section>;
};

const RequireAuth = ({ allowedRoles }) => {
  const user = useAuth();
  const location = useLocation();
  const restoring = useSelector((state) => state.auth.restoring);
  const { failed } = useContext(RestoreContext);

  if (!user && failed) return <section className="box py-12 text-center"><h1 className="font-serif text-3xl">Your account is temporarily unavailable</h1><p className="mt-3 text-[#6b6257]">Your saved account could not be restored. Use the retry option above when your connection is available.</p></section>;

  if (restoring) return <PageLoading />;

  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location, reason: location.pathname === "/recipe/saved" ? "Sign in to view your saved recipes." : "Sign in to continue." }} replace />;
  }
  if (!user.roles.some((role) => allowedRoles.includes(role))) {
    return <AccessUnavailable />;
  }
  return <Outlet />;
};

RequireAuth.propTypes = { allowedRoles: P.arrayOf(P.string).isRequired };

export default RequireAuth;
