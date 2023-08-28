import { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PageLoading } from "../../components";

const RequireAuth = ({ allowedRoles }) => {
  const user = useAuth();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!user) {
      const timeoutId = setTimeout(() => {
        setRedirecting(true);
      }, 4000); // Adjust the timeout value as needed

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [user]);

  if (redirecting) {
    return (
      <Navigate
        to={"/auth/signin"}
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
