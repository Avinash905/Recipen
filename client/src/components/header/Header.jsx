import { useState } from "react";
import Logo from "../logo/Logo";
import Menu from "./Menu";
import Avatar from "../avatar/Avatar";
import { Link, NavLink } from "react-router-dom";
import { FiLogIn, FiMenu } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const user = useAuth();

  return (
    <header className="shadow-sm sticky top-0 backdrop-blur-sm bg-[#fffefc80] z-20">
      <div className="box flex justify-between items-center py-3">
        <Logo />
        {/* Desktop navbar */}
        <nav className="hidden md:block">
          {/* Navbar links */}
          <ul className="flex gap-10">
            <li>
              <NavLink
                to={"/"}
                className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center font-semibold text-gray-600"
              >
                Home
              </NavLink>
            </li>
            {user && user?.isAdmin && (
              <li>
                <NavLink
                  to={"/dashboard/users"}
                  className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center font-semibold text-gray-600"
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to={"/recipe"}
                className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center font-semibold text-gray-600"
              >
                Recipes
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/blog"}
                className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center font-semibold text-gray-600"
              >
                Stories
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/contact"}
                className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center font-semibold text-gray-600"
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* Sign in button */}
        {user ? (
          <Avatar />
        ) : (
          <Link to="/auth/signin" className="hidden items-center gap-2 rounded-full bg-primaryLight px-5 py-2 font-semibold text-[#29251f] md:flex">Sign in <FiLogIn aria-hidden="true" /></Link>
        )}
        {/* Menu button */}
        <button type="button" className="block md:hidden p-2 text-xl" aria-label="Open navigation" aria-expanded={!isCollapsed} aria-controls="mobile-navigation" onClick={() => setIsCollapsed(false)}>
          <FiMenu aria-hidden="true" />
        </button>

        {/* Mobile navbar */}
        <Menu
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
          user={user}
        />
      </div>
    </header>
  );
};

export default Header;
