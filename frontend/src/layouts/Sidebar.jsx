import { NavLink, Link } from "react-router-dom";
import {
  Home,
  BedDouble,
  CarFront,
  Star,
  Phone,
  ShieldCheck,
  Mountain,
  X,
} from "lucide-react";
import { SITE, telHref } from "../config/site";
import { ROLE_LABELS, useAuth } from "../context/authStore";

const menuItems = [
  { name: "Home", path: "/", icon: Home, end: true },
  { name: "Rooms", path: "/rooms", icon: BedDouble },
  { name: "Transport", path: "/transport", icon: CarFront },
  { name: "Reviews", path: "/reviews", icon: Star },
  { name: "Contact", path: "/contact", icon: Phone },
];

const Sidebar = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-800/60 bg-slate-900 text-slate-200">
      {/* ---------- Brand ---------- */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 px-6 py-6">
        <Link to="/" onClick={onNavigate} className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-600/25">
            <Mountain className="h-5 w-5 text-white" />
          </span>
          <span>
            <span className="block font-display text-xl font-semibold tracking-tight text-white">
              {SITE.name}
            </span>
            <span className="block text-xs text-slate-400">
              {SITE.location.split(",")[0]} · Queen of Hills
            </span>
          </span>
        </Link>

        {/* Close button only renders on mobile drawer */}
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ---------- Navigation ---------- */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {menuItems.map(({ name, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-brand-500/10 text-brand-300"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-400" />
                )}
                <Icon className="h-[18px] w-[18px] transition-transform group-hover:scale-110" />
                {name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ---------- Footer ---------- */}
      <div className="space-y-3 border-t border-slate-800/80 p-4">
        <a
          href={telHref}
          className="block rounded-xl bg-gradient-to-br from-brand-500/15 to-brand-400/5 p-3.5 ring-1 ring-brand-500/20 transition hover:ring-brand-400/40"
        >
          <p className="text-sm font-semibold text-white">Need help booking?</p>
          <p className="mt-0.5 text-xs text-slate-400">
            Call {SITE.phoneDisplay}
          </p>
        </a>

        {/* Only staff ever see the console entry point. */}
        {isAdmin && (
          <Link
            to="/admin"
            onClick={onNavigate}
            className="group flex w-full items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-left transition hover:border-brand-500/40 hover:bg-slate-800"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-700/80 text-slate-300 transition group-hover:bg-brand-500/15 group-hover:text-brand-300">
              <ShieldCheck className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-white">
                Admin Console
              </span>
              <span className="block truncate text-xs text-slate-400">
                Signed in as {ROLE_LABELS[user.role]}
              </span>
            </span>
          </Link>
        )}

        <p className="pt-1 text-center text-[11px] text-slate-600">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
