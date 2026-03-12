import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  TicketCheck,
  LifeBuoy,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", path: "/", icon: LayoutDashboard },
    { name: "Explore Ooty", path: "/contact", icon: Map },
    { name: "My Bookings", path: "/contact", icon: TicketCheck },
    { name: "Help & Support", path: "/contact", icon: LifeBuoy },
  ];

  return (
    <aside className="h-full w-64 bg-slate-900/95 backdrop-blur-xl text-slate-200 flex flex-col border-r border-slate-800 shadow-2xl">
      {/* ---------- Brand ---------- */}
      <div className="px-6 py-5 border-b border-slate-800">
        <h2 className="text-xl font-semibold tracking-wide flex items-center gap-2 text-white">
          OotyTrips
        </h2>
        <p className="text-md text-slate-400 mt-1">
          Discover the Queen of Hills
        </p>
      </div>

      {/* ---------- Navigation ---------- */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "hover:bg-slate-800 text-slate-300 hover:text-white"
              }`
            }
          >
            <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* ---------- Footer Card ---------- */}
      <div className="p-4 border-t border-slate-800">
        <Link to="/admin">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200">
            Admin Page
          </button>
        </Link>
        <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-400/5 border border-emerald-500/20 p-3">
          <p className="text-sm font-semibold text-white">Welcome back 👋</p>
          <p className="text-xs text-slate-400">Plan your peaceful Ooty trip</p>
        </div>

        <p className="text-[11px] text-slate-500 mt-4 text-center">
          © {new Date().getFullYear()} OotyTrips
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
