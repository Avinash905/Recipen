import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";
import useTitle from "../hooks/useTitle";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  useTitle("Recipen - Dashboard");

  return (
    <section className="flex w-full min-w-0">
      <Sidebar
        setIsCollapsed={setIsCollapsed}
        isCollapsed={isCollapsed}
      />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </section>
  );
};

export default DashboardLayout;
