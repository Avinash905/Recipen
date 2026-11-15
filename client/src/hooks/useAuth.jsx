import { useSelector } from "react-redux";
import { profileBg } from "../assets";

const useAuth = () => {
  const { token, user } = useSelector((state) => state.auth);
  let isProUser = false;
  let isAdmin = false;

  if (token && user) {
    const { userId, name, email, profilePicture, roles, favorites } =
      user;

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
