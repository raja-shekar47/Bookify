import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarFront, Phone, Snowflake, Users, X } from "lucide-react";
import API, { getErrorMessage } from "../services/api";
import PageHeader from "../components/PageHeader";
import SmartImage from "../components/SmartImage";
import StatusBadge from "../components/StatusBadge";
import BookingForm from "../features/booking/BookingForm";
import {
  CardSkeletonGrid,
  EmptyState,
  ErrorState,
} from "../components/Feedback";
import { formatCurrency } from "../utils/format";
import { SITE, telHref } from "../config/site";

const Transport = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/transport");
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load the vehicle list."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <PageHeader
        eyebrow="Transport"
        title="Cabs, SUVs & tempo travellers"
        description="Our own fleet with local drivers. Fares are per day and include fuel and driver bata for Ooty–Coonoor sightseeing."
        action={
          <a href={telHref} className="btn-ghost">
            <Phone className="h-4 w-4" />
            {SITE.phoneDisplay}
          </a>
        }
      />

      {loading && <CardSkeletonGrid count={3} />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchVehicles} />
      )}

      {!loading && !error && vehicles.length === 0 && (
        <EmptyState
          title="No vehicles listed yet"
          description="Add your fleet from the admin console under the Transport tab."
        />
      )}

      {!loading && !error && vehicles.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <article
              key={vehicle._id}
              className="card-surface group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)]"
            >
              <div className="relative h-48 overflow-hidden">
                <SmartImage
                  src={vehicle.image}
                  alt={vehicle.name}
                  fallbackLabel={vehicle.name}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3">
                  <StatusBadge
                    status={vehicle.status}
                    className="bg-white/95 backdrop-blur"
                  />
                </div>
                <span className="absolute right-3 top-3 rounded-full bg-slate-900/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {vehicle.type}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {vehicle.name}
                </h3>

                {vehicle.description && (
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {vehicle.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {vehicle.seats} seats
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Snowflake className="h-3.5 w-3.5" />
                    {vehicle.ac ? "AC" : "Non-AC"}
                  </span>
                  {vehicle.driverName && (
                    <span className="inline-flex items-center gap-1.5">
                      <CarFront className="h-3.5 w-3.5" /> {vehicle.driverName}
                    </span>
                  )}
                </div>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                  <p className="leading-tight">
                    <span className="font-display text-xl font-semibold text-slate-900">
                      {formatCurrency(vehicle.pricePerDay)}
                    </span>
                    <span className="block text-xs text-slate-500">per day</span>
                  </p>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${vehicle.contactNumber || SITE.phone}`}
                      className="btn-ghost px-3 py-2.5"
                      aria-label={`Call about ${vehicle.name}`}
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setSelected(vehicle)}
                      disabled={vehicle.status !== "available"}
                      className="btn-primary px-4 py-2.5"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ---------------- Booking modal ---------------- */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm sm:p-8">
          <div className="card-surface my-auto w-full max-w-lg animate-fade-up p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  Book a vehicle
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-slate-900">
                  {selected.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {formatCurrency(selected.pricePerDay)} per day ·{" "}
                  {selected.seats} seats
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <BookingForm
              kind="transport"
              item={selected}
              unitPrice={selected.pricePerDay}
              maxGuests={selected.seats}
              onSuccess={(booking) => {
                setSelected(null);
                navigate(`/booking/${booking.reference}`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Transport;
