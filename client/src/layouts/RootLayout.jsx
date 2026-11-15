import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import BackToTop from "../components/backToTop/BackToTop";

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#29251f] focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <Header />
      <main id="main-content" className="flex-1"><Outlet /></main>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default RootLayout;
