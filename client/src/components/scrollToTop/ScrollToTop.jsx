import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const positions = new Map();
const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const locationKey = `${location.pathname}${location.search}`;
  const previousPath = useRef(null);

  useLayoutEffect(() => {
    const isFilterUpdate = previousPath.current === location.pathname && navigationType === "REPLACE" && !location.state?.restoreScroll;
    previousPath.current = location.pathname;
    const shouldRestore = navigationType === "POP" || location.state?.restoreScroll;
    let frame;
    if (isFilterUpdate) positions.set(locationKey, window.scrollY);
    else frame = requestAnimationFrame(() => window.scrollTo(0, shouldRestore ? positions.get(locationKey) || 0 : 0));
    const record = () => positions.set(locationKey, window.scrollY);
    window.addEventListener("scroll", record, { passive: true });
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", record);
    };
  }, [locationKey, location.pathname, location.key, location.state?.restoreScroll, navigationType]);
  return null;
};
export default ScrollToTop;
