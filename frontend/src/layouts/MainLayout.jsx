import { useEffect, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Menu, Mountain, Phone } from "lucide-react";
import Sidebar from "./Sidebar";
import { SITE, telHref } from "../config/site";

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Scroll back to the top on navigation. (The drawer closes itself via the
  // onNavigate callback each link fires.)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-sand-50">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full animate-fade-up">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur-lg lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600">
              <Mountain className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-lg font-semibold text-slate-900">
              {SITE.name}
            </span>
          </Link>

          <a
            href={telHref}
            className="rounded-lg p-2 text-brand-600 transition hover:bg-brand-50"
            aria-label="Call us"
          >
            <Phone className="h-5 w-5" />
          </a>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center text-xs text-slate-500">
          <p className="font-medium text-slate-700">{SITE.name}</p>
          <p className="mt-1">
            {SITE.address} · {SITE.phoneDisplay} · {SITE.email}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
