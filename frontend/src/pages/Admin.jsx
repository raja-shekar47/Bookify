import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  CalendarCheck,
  CarFront,
  IndianRupee,
  LogOut,
  Mountain,
  Star,
  Users,
} from "lucide-react";
import API from "../services/api";
import RoomsAdmin from "../features/admin/RoomsAdmin";
import TransportAdmin from "../features/admin/TransportAdmin";
import BookingsAdmin from "../features/admin/BookingsAdmin";
import ReviewsAdmin from "../features/admin/ReviewsAdmin";
import UsersAdmin from "../features/admin/UsersAdmin";
import { formatCurrency } from "../utils/format";
import { SITE } from "../config/site";
import { ROLE_LABELS, useAuth } from "../context/authStore";

const TABS = [
  { key: "bookings", label: "Bookings", icon: CalendarCheck },
  { key: "rooms", label: "Rooms", icon: BedDouble },
  { key: "transport", label: "Transport", icon: CarFront },
  { key: "reviews", label: "Reviews", icon: Star },
  // Managing people belongs to the super admin alone.
  { key: "users", label: "People", icon: Users, superAdminOnly: true },
];

const StatCard = ({ icon: Icon, label, value, hint, loading }) => (
  <div className="card-surface p-5">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="h-[18px] w-[18px]" />
      </span>
    </div>
    {loading ? (
      <div className="mt-4 h-6 w-20 animate-pulse rounded bg-slate-200" />
    ) : (
      <p className="mt-3 font-display text-2xl font-semibold text-slate-900">
        {value}
      </p>
    )}
    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
  </div>
);

const Admin = () => {
  const { user, isSuperAdmin, signOut } = useAuth();
  const [tab, setTab] = useState("bookings");
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    rooms: 0,
    vehicles: 0,
    pending: 0,
    revenue: 0,
    reviews: 0,
  });

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      const [rooms, transport, bookings, reviews] = await Promise.all([
        API.get("/rooms"),
        API.get("/transport"),
        API.get("/bookings"),
        API.get("/reviews"),
      ]);

      const all = Array.isArray(bookings.data) ? bookings.data : [];

      setStats({
        rooms: rooms.data?.length || 0,
        vehicles: transport.data?.length || 0,
        pending: all.filter((b) => b.status === "pending").length,
        revenue: all
          .filter((b) => b.status === "confirmed")
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        reviews: reviews.data?.length || 0,
      });
    } catch {
      // Stats are informational — a failure here shouldn't block the console.
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* ---------------- Top bar ---------------- */}
      <header className="border-b border-slate-800/60 bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-600/25">
              <Mountain className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-white">
                {SITE.name} · Admin
              </p>
              <p className="text-xs text-slate-400">
                {user?.name} · {ROLE_LABELS[user?.role]}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-brand-500/40 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>

            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-rose-500/40 hover:bg-slate-800 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* ---------------- Stats ---------------- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={CalendarCheck}
            label="Pending bookings"
            value={stats.pending}
            hint="Waiting for your confirmation"
            loading={statsLoading}
          />
          <StatCard
            icon={IndianRupee}
            label="Confirmed revenue"
            value={formatCurrency(stats.revenue)}
            hint="Across all confirmed bookings"
            loading={statsLoading}
          />
          <StatCard
            icon={BedDouble}
            label="Rooms listed"
            value={stats.rooms}
            hint={`${stats.vehicles} vehicles in the fleet`}
            loading={statsLoading}
          />
          <StatCard
            icon={Star}
            label="Guest reviews"
            value={stats.reviews}
            hint="Published on the public site"
            loading={statsLoading}
          />
        </div>

        {/* ---------------- Tabs ---------------- */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
          {TABS.filter(
            ({ superAdminOnly }) => !superAdminOnly || isSuperAdmin,
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`-mb-px inline-flex items-center gap-2 rounded-t-xl border-b-2 px-4 py-3 text-sm font-semibold transition ${
                tab === key
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ---------------- Panel ---------------- */}
        <div className="pb-10">
          {tab === "bookings" && <BookingsAdmin onChanged={loadStats} />}
          {tab === "rooms" && <RoomsAdmin onChanged={loadStats} />}
          {tab === "transport" && <TransportAdmin onChanged={loadStats} />}
          {tab === "reviews" && <ReviewsAdmin onChanged={loadStats} />}
          {tab === "users" && isSuperAdmin && <UsersAdmin />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
