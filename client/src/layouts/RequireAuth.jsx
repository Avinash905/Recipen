import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);

  return token ? (
    <Outlet />
  ) : (
    <Navigate
      to="/auth/signin"
      state={{ from: location }}
      replace
    />
  );
  // if (token) {
  //   if (jwtDecode(token)?.roles.find((role) => allowedRoles?.includes(role))) {
  //     <Outlet />;
  //   } else {
  //     <Navigate
  //       to={"/error"}
  //       state={{ from: location }}
  //       replace
  //     />;
  //   }
  // } else {
  //   return (
  //     <Navigate
  //       to={"/auth/signin"}
  //       state={{ from: location }}
  //       replace
  //     />
  //   );
  // }
};

export default RequireAuth;
