import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CarFront,
  ChefHat,
  Mountain,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import BookingSearch from "../features/booking/BookingSearch";
import RoomList from "../features/rooms/RoomList";
import { SITE, telHref } from "../config/site";

const highlights = [
  {
    icon: ChefHat,
    title: "Kitchen in every unit",
    text: "Cook your own meals — full modular kitchen, utensils and a kettle provided.",
  },
  {
    icon: Wifi,
    title: "Free WiFi & hot water",
    text: "Round-the-clock hot water and reliable internet through your whole stay.",
  },
  {
    icon: CarFront,
    title: "Transport on call",
    text: "Cars, SUVs and tempo travellers with local drivers who know the hills.",
  },
  {
    icon: ShieldCheck,
    title: "Family-run & safe",
    text: "Owner-managed property with free parking and 24/7 on-site help.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 pb-16">
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/90" />

        <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-16 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-200 ring-1 ring-inset ring-white/20">
            <Mountain className="h-3.5 w-3.5" />
            {SITE.location}
          </span>

          <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Stay at {SITE.name}, your home in the Queen of Hills with us.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Clean, homely rooms and family suites with kitchens — a short drive
            from Ooty Lake, the Botanical Garden and the Coonoor tea estates.
            Book a room, arrange your cab, and we handle the rest.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/rooms" className="btn-primary">
              Explore rooms
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Call {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- Search bar (overlaps hero) ---------------- */}
      <section className="relative z-10 mx-auto -mt-36 max-w-6xl px-6">
        <BookingSearch
          buttonLabel="Search rooms"
          onSearch={() => navigate("/rooms")}
        />
      </section>

      {/* ---------------- Highlights ---------------- */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-surface p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Rooms ---------------- */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
              <Sparkles className="h-3.5 w-3.5" />
              Our rooms
            </span>
            <h2 className="section-title mt-2">Pick where you'll sleep</h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Every room is serviced daily and priced per night, taxes included.
            </p>
          </div>

          <Link
            to="/rooms"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            View all rooms →
          </Link>
        </div>

        <RoomList limit={3} showFilters={false} />
      </section>

      {/* ---------------- Transport CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-brand-900 px-8 py-12 text-center sm:px-12">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-brand-200 mx-auto">
            <CarFront className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold text-white sm:text-3xl">
            Getting around Ooty?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
            We run our own fleet — sedans, SUVs, tempo travellers and open jeeps
            with drivers who've grown up on these roads. Airport pick-ups from
            Coimbatore included.
          </p>
          <Link to="/transport" className="btn-primary mt-7">
            See vehicles & fares
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
