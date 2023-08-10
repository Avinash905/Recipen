import React, { useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const isVisible = scrollY > 300; // Show the button when the user has scrolled 300 pixels down
    setIsVisible(isVisible);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top with smooth animation
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`fixed bottom-8 left-6 ${isVisible ? "block" : "hidden"}`}>
      <MdKeyboardArrowUp
        onClick={scrollToTop}
        className="animate-bounce text-5xl bg-primary rounded-full shadow shadow-primaryLight cursor-pointer text-light p-3"
      />
    </div>
  );
};

export default BackToTop;
