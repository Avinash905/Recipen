import React, { useState } from "react";
import { AiOutlineShareAlt } from "react-icons/ai";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

const ShareButton = ({ url }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative inline-block">
      <AiOutlineShareAlt
        className="text-2xl text-primary cursor-pointer"
        onClick={toggleMenu}
      />
      {isMenuOpen && (
        <div className="absolute -left-2 top-9 max-w-max bg-white border rounded shadow-lg z-10 pt-1">
          <FacebookShareButton
            url={url}
            onClick={toggleMenu}
          >
            <FacebookIcon
              round
              className="mx-2 my-1 text-blue-600 hover:text-blue-800"
              size={24}
            />
          </FacebookShareButton>
          <TwitterShareButton
            url={url}
            onClick={toggleMenu}
          >
            <TwitterIcon
              round
              className="mx-2 my-1 text-blue-400 hover:text-blue-600"
              size={24}
            />
          </TwitterShareButton>
          <LinkedinShareButton
            url={url}
            onClick={toggleMenu}
          >
            <LinkedinIcon
              round
              className="mx-2 my-1 text-blue-700 hover:text-blue-900"
              size={24}
            />
          </LinkedinShareButton>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
