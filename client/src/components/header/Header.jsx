import React, { useState } from "react";
import { Logo, Button, Menu, Avatar } from "..";
import { Link, NavLink } from "react-router-dom";
import { FiLogIn, FiMenu } from "react-icons/fi";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ROLES from "../../common/roles";

const Header = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const token = useSelector(selectCurrentToken);

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
            {token &&
              jwtDecode(token)?.UserInfo?.roles?.includes(
                parseInt(ROLES?.Admin)
              ) && (
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
                Blogs
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
        {token ? (
          <Avatar profilePicture={token} />
        ) : (
          <Link
            to={"/auth/signin"}
            className="hidden md:block"
          >
            <Button
              content={"Sign In"}
              customCss={"max-w-max rounded-full"}
              icon={<FiLogIn />}
            />
          </Link>
        )}
        {/* Menu button */}
        <FiMenu
          className="block md:hidden text-xl cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Mobile navbar */}
        <Menu
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
        />
      </div>
    </header>
  );
};

export default Header;
