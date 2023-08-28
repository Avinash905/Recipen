import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";
import { profileBg } from "../assets";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isProUser = false;
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    const { userId, name, email, profilePicture, roles, favorites } =
      decoded.UserInfo;

    isProUser = roles.includes("ProUser");
    isAdmin = roles.includes("Admin");

    return {
      userId,
      name,
      email,
      profilePicture: profilePicture || profileBg,
      roles,
      favorites,
      isProUser,
      isAdmin,
    };
  }

  return null;
};
export default useAuth;
