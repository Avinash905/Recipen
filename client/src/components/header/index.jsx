import React, { useState } from "react";
import { Logo, Button, Menu } from "..";
import { Link, NavLink } from "react-router-dom";
import { FiLogIn, FiMenu } from "react-icons/fi";

const index = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

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
                to={"/blogs"}
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

export default index;
