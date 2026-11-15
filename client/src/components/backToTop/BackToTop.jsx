import { useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const isVisible = scrollY > 300; // Show the button when the user has scrolled 300 pixels down
    setIsVisible(isVisible);
  };

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button type="button" aria-label="Back to top" onClick={scrollToTop} className={`fixed bottom-8 right-6 z-10 rounded-full bg-primary p-3 text-2xl text-[#29251f] shadow shadow-primaryLight focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#775421] ${isVisible ? "hidden sm:block" : "hidden"}`}>
      <MdKeyboardArrowUp aria-hidden="true" />
    </button>
  );
};

export default BackToTop;
