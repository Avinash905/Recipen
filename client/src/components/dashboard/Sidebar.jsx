import P from "prop-types";
import { FiMenu } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiHomeAlt2 } from "react-icons/bi";
import { BsFileEarmarkText } from "react-icons/bs";
import { HiOutlineUsers, HiOutlineLogout } from "react-icons/hi";
import { IoRestaurantOutline } from "react-icons/io5";
import Logo from "../logo/Logo";
import { Avatar as MuiAvatar } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../features/auth/authApiSlice";
import { useStore } from "react-redux";
import { sameSession } from "../../features/auth/authSlice";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const user = useAuth();
  const store = useStore();

  const [logout] = useLogoutMutation();

  const navigate = useNavigate();
  const linkClass = ({ isActive }) => `rounded-lg p-2 flex gap-2 items-center ${isCollapsed ? "justify-center" : ""} ${isActive ? "bg-[#e9dfd0] text-[#29251f] font-semibold" : "text-gray-600 hover:bg-[#eee7dc] hover:text-[#29251f]"}`;

  const handleLogout = async () => {
    const startingToken = store.getState().auth.token;
    try {
      await logout().unwrap();
    } catch (error) {
      toast.error("Signed out locally, but the server session could not be revoked. Please try again when connected.");
    }
    const currentToken = store.getState().auth.token;
    if (currentToken && !sameSession(currentToken, startingToken)) return;
    localStorage.setItem("persist", false);
    navigate("/auth/signin");
  };

  return (
    <motion.aside className={`h-screen shrink-0 overflow-y-auto p-3 sm:p-6 flex flex-col justify-between bg-[#f8f3eb] border-r border-[#e8e1d7] ${isCollapsed ? "w-[72px] sm:w-24" : "w-[min(260px,70vw)]"}`}>
      <div className="flex flex-col gap-6">
        <div
          className={`flex ${
            isCollapsed ? "flex-col" : "flex-row"
          } justify-between items-center`}
        >
          <Logo hideName={isCollapsed ? true : false} />
          {isCollapsed && <hr className="w-full my-6" />}
          <button type="button" aria-label={isCollapsed ? "Expand dashboard menu" : "Collapse dashboard menu"} aria-expanded={!isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)} className="p-2">
            <FiMenu aria-hidden="true" />
          </button>
        </div>
        <hr />
        {/* Profile details */}
        <div className="flex gap-2 items-center">
          <div className="w-12 h-12">
            <MuiAvatar
              alt={user?.name}
              src={user?.profilePicture}
              sx={{ width: 48, height: 48 }}
              className="rounded-full border-primary border-2 -mr-2"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col gap-1">
              <h2 className="font-bold">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          )}
        </div>
        <hr />
        {/* Navbar links */}
        <div className="flex flex-col gap-6 pl-2">
          <NavLink
            to={"/"}
            aria-label="Home" title="Home"
            className={linkClass}
          >
            <BiHomeAlt2 />
            {!isCollapsed && "Home"}
          </NavLink>
          <NavLink
            to={"/dashboard/users"}
            aria-label="Users" title="Users"
            className={linkClass}
          >
            <HiOutlineUsers />
            {!isCollapsed && "Users"}
          </NavLink>
          <NavLink
            to={"/dashboard/recipes"}
            aria-label="Recipes" title="Recipes"
            className={linkClass}
          >
            <IoRestaurantOutline />
            {!isCollapsed && "Recipes"}
          </NavLink>
          <NavLink
            to={"/dashboard/blogs"}
            aria-label="Stories" title="Stories"
            className={linkClass}
          >
            <BsFileEarmarkText />
            {!isCollapsed && "Stories"}
          </NavLink>
        </div>
      </div>
      <hr />
      <button
        type="button"
        aria-label="Logout" title="Logout"
        className={`mb-4 flex gap-2 items-center text-gray-600 rounded-lg hover:bg-gradient-to-r hover:from-primary hover:to-primaryLight hover:text-[#29251f] p-2 cursor-pointer ml-2 ${
          isCollapsed && "justify-center"
        }`}
        onClick={handleLogout}
      >
        <HiOutlineLogout />
        {!isCollapsed && "Logout"}
      </button>
    </motion.aside>
  );
};

Sidebar.propTypes = { isCollapsed: P.bool, setIsCollapsed: P.func.isRequired };

export default Sidebar;
