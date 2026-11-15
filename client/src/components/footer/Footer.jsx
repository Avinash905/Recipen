import {
  AiFillGithub,
  AiFillLinkedin,
  AiFillTwitterCircle,
} from "react-icons/ai";
import Logo from "../logo/Logo";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-[#e8e1d7] bg-[#f8f3eb] pt-12 mt-24">
      {/* Footer top */}
      <div className="box flex flex-col md:flex-row  justify-between border-b border-[#e8e1d7] pb-10 gap-8">
        {/* Footer top left */}
        <div className="basis-1/2 flex flex-col gap-6 items-center md:items-start text-center md:text-start">
          <Logo />
          <p>
            Explore recipes and food stories shared by the Recipen community.
          </p>
        </div>
        {/* Footer top right */}
        <div className="flex gap-10 basis-1/2 justify-center md:justify-end flex-wrap md:flex-nowrap">
          {/* Footer links */}
          <ul className="flex flex-col gap-2 font-semibold mx-8 items-center md:items-start">
            <li className="text-gray-700 text-sm text-bold mb-2">Product</li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/blog">Stories</Link>
            </li>
            <li>
              <Link to="/recipe">Recipes</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Footer bottom */}
      <div className="box !mb-0 flex justify-center sm:justify-between flex-col sm:flex-row w-full gap-4 pb-8">
        <p className="text-sm text-center">
          &copy; {new Date().getFullYear()} Recipen. All rights reserved
        </p>
        {/* Footer social links */}
        <ul className="flex justify-center gap-6 text-xl">
          <li
            className="border border-[#cfc6ba] p-1 rounded-full hover:text-gray-500"
          >
            <a
              href="https://github.com/Avinash905"
              aria-label="Follow me on github"
            >
              <AiFillGithub />
            </a>
          </li>
          <li
            className="border border-[#cfc6ba] p-1 rounded-full hover:text-blue-400"
          >
            <a
              href="https://twitter.com/avinashdunna"
              aria-label="Follow me on twitter"
            >
              <AiFillTwitterCircle />
            </a>
          </li>
          <li
            className="border border-[#cfc6ba] p-1 rounded-full hover:text-blue-600"
          >
            <a
              href="https://www.linkedin.com/in/dunna-avinash"
              aria-label="Follow me on linkedin"
            >
              <AiFillLinkedin />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
