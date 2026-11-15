import P from "prop-types";
import { FiLogIn, FiMenu } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import { Drawer } from "@mui/material";


const Menu = ({ isCollapsed, setIsCollapsed, user }) => {
  return (
    <>
      <Drawer anchor="right" open={!isCollapsed} onClose={() => setIsCollapsed(true)}
        PaperProps={{ id: "mobile-navigation", "aria-label": "Mobile navigation", sx: { width: "min(300px, 85vw)", padding: 3, backgroundColor: "#fffefb" } }}>
          {/* Menu button */}
          <button type="button" className="block md:hidden p-2 text-xl" aria-label="Close navigation" onClick={() => setIsCollapsed(true)}>
            <FiMenu aria-hidden="true" />
          </button>
          {/* Navbar links */}
          <ul className="flex flex-col gap-10 items-center mt-8">
            <li>
              <NavLink
                to={"/"}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center font-semibold text-gray-600"
              >
                Home
              </NavLink>
            </li>
            {user && user?.isAdmin && (
              <li>
                <NavLink
                  to={"/dashboard/users"}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center font-semibold text-gray-600"
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to={"/recipe"}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center font-semibold text-gray-600"
              >
                Recipes
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/blog"}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center font-semibold text-gray-600"
              >
                Stories
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/contact"}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center font-semibold text-gray-600"
              >
                Contact
              </NavLink>
            </li>
            {!user && (
              <li className="w-full">
                <Link to="/auth/signin" onClick={() => setIsCollapsed(true)} className="flex w-full items-center justify-center gap-3 rounded-full bg-primaryLight px-5 py-3 font-semibold text-[#29251f]">Sign in <FiLogIn aria-hidden="true" /></Link>
              </li>
            )}
          </ul>
      </Drawer>
    </>
  );
};

Menu.propTypes = { isCollapsed: P.bool, setIsCollapsed: P.func.isRequired, user: P.shape({ isAdmin: P.bool }) };

export default Menu;
