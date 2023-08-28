import { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PageLoading } from "../../components";

const RequireAuth = ({ allowedRoles }) => {
  const user = useAuth();
  const location = useLocation();
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setRedirect("/auth/signin");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  if (redirect) {
    return (
      <Navigate
        to={redirect}
        state={{ from: location }}
        replace
      />
    );
  }

  if (user) {
    if (user?.roles?.some((role) => allowedRoles.includes(role))) {
      return <Outlet />;
    } else {
      return (
        <Navigate
          to={"/error"}
          state={{ from: location }}
          replace
        />
      );
    }
  }

  return <PageLoading />;
};

export default RequireAuth;
