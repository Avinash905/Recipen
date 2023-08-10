import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);
  if (token) {
    if (
      jwtDecode(token)?.UserInfo?.roles?.find((role) =>
        allowedRoles?.includes(role?.toString())
      )
    ) {
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
  } else {
    return (
      <Navigate
        to={"/auth/signin"}
        state={{ from: location }}
        replace
      />
    );
  }
};

export default RequireAuth;
