import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="h-screen flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
