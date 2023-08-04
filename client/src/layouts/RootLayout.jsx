import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer, BackToTop } from "../components";

const RootLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <BackToTop />
      <Footer />
    </>
  );
};

export default RootLayout;
