import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BedDouble,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Mail,
  Phone,
  Search,
  Users,
} from "lucide-react";
import API, { getErrorMessage } from "../services/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { Spinner } from "../components/Feedback";
import { formatCurrency, formatDate } from "../utils/format";
import { SITE, mailHref, telHref } from "../config/site";

/**
 * Serves two routes:
 *   /booking/:reference  — confirmation shown right after booking
 *   /booking-status      — guest lookup form
 */
const BookingStatus = () => {
  const { reference } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(Boolean(reference));
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchBooking = useCallback(async (ref) => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get(`/bookings/reference/${ref}`);
      setBooking(data);
    } catch (err) {
      setBooking(null);
      setError(
        getErrorMessage(err, "We couldn't find a booking with that reference."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reference) fetchBooking(reference);
  }, [reference, fetchBooking]);

  const handleLookup = (e) => {
    e.preventDefault();
    const ref = query.trim().toUpperCase();
    if (!ref) {
      setError("Enter your booking reference.");
      return;
    }
    navigate(`/booking/${ref}`);
  };

  if (loading) return <Spinner label="Fetching your booking…" />;

  // ---------------- Lookup form ----------------
  if (!booking) {
    return (
      <div className="mx-auto max-w-lg space-y-6 px-6 py-12">
        <PageHeader
          eyebrow="Your trip"
          title="Find your booking"
          description="Enter the reference from your confirmation, e.g. AS-7K2M9Q."
        />

        <form onSubmit={handleLookup} className="card-surface space-y-4 p-6">
          <div>
            <label className="field-label" htmlFor="ref">
              Booking reference
            </label>
            <input
              id="ref"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError("");
              }}
              placeholder="AS-XXXXXX"
              className="field-input font-mono uppercase tracking-wider"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full">
            <Search className="h-4 w-4" />
            Find booking
          </button>

          <p className="text-center text-xs text-slate-500">
            Lost your reference? Call {SITE.phoneDisplay} and we'll look it up.
          </p>
        </form>
      </div>
    );
  }

  // ---------------- Confirmation ----------------
  const isRoom = booking.kind === "room";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-10">
      <div className="card-surface animate-fade-up overflow-hidden">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-8 text-center text-white">
          <CheckCircle2 className="mx-auto h-11 w-11" />
          <h1 className="mt-4 font-display text-2xl font-semibold">
            Booking received
          </h1>
          <p className="mt-2 text-sm text-brand-100">
            We'll call you on {booking.mobile} shortly to confirm.
          </p>

          <p className="mt-5 inline-block rounded-xl bg-white/15 px-5 py-2.5 font-mono text-lg font-semibold tracking-[0.2em] backdrop-blur">
            {booking.reference}
          </p>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                {isRoom ? (
                  <BedDouble className="h-5 w-5" />
                ) : (
                  <CarFront className="h-5 w-5" />
                )}
              </span>
              <div>
                <p className="font-semibold text-slate-900">
                  {booking.itemTitle}
                </p>
                <p className="text-xs text-slate-500">
                  {isRoom ? "Room booking" : "Transport booking"}
                </p>
              </div>
            </div>

            <StatusBadge status={booking.status} />
          </div>

          <dl className="grid grid-cols-2 gap-4 border-y border-slate-100 py-5 text-sm">
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                {isRoom ? "Check in" : "From"}
              </dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {formatDate(booking.checkIn)}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                {isRoom ? "Check out" : "To"}
              </dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {formatDate(booking.checkOut)}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Users className="h-3.5 w-3.5" />
                Guests
              </dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {booking.guests}
                {isRoom && booking.rooms > 1 ? ` · ${booking.rooms} rooms` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {isRoom ? "Nights" : "Days"}
              </dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {booking.nights}
              </dd>
            </div>
          </dl>

          <div className="flex items-center justify-between rounded-xl bg-sand-100 px-4 py-3.5">
            <span className="text-sm font-medium text-slate-600">
              Total payable at property
            </span>
            <span className="font-display text-xl font-semibold text-slate-900">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>

          {booking.notes && (
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Your note:</span>{" "}
              {booking.notes}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <a href={telHref} className="btn-ghost">
              <Phone className="h-4 w-4" />
              {SITE.phoneDisplay}
            </a>
            <a href={mailHref} className="btn-ghost">
              <Mail className="h-4 w-4" />
              Email us
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-ghost">
          Back to home
        </Link>
        <Link to="/transport" className="btn-ghost">
          Add a cab to your trip
        </Link>
      </div>
    </div>
  );
};

export default BookingStatus;
