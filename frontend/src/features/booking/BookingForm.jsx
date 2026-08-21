import { useState } from "react";
import { CalendarCheck, Loader2, Lock } from "lucide-react";
import API, { getErrorMessage } from "../../services/api";
import { useSearch } from "../../context/searchStore";
import {
  addDaysInput,
  formatCurrency,
  nightsBetween,
  todayInput,
} from "../../utils/format";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^[0-9]{10}$/;

/**
 * Booking form shared by rooms and vehicles.
 *
 * @param {"room"|"transport"} kind
 * @param {object} item        the room or transport document
 * @param {number} unitPrice   per night (room) or per day (vehicle)
 */
const BookingForm = ({
  kind = "room",
  item,
  unitPrice,
  maxGuests = 4,
  disabled = false,
  onSuccess,
}) => {
  const { criteria } = useSearch();
  const isRoom = kind === "room";

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    checkIn: criteria.checkIn || todayInput(),
    checkOut: criteria.checkOut || addDaysInput(todayInput(), 1),
    guests: Math.min(Number(criteria.guests) || 1, maxGuests),
    rooms: Math.min(Number(criteria.rooms) || 1, 4),
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const nights = nightsBetween(form.checkIn, form.checkOut);
  const units = isRoom ? Number(form.rooms) || 1 : 1;
  const total = unitPrice * Math.max(nights, 0) * units;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "checkIn" && next.checkOut <= value) {
        next.checkOut = addDaysInput(value, 1);
      }
      return next;
    });
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!mobilePattern.test(form.mobile.trim()))
      return "Enter a valid 10-digit mobile number.";
    if (!emailPattern.test(form.email.trim()))
      return "Enter a valid email address.";
    if (!form.checkIn || !form.checkOut) return "Pick your travel dates.";
    if (nights < 1) return "Check-out must be after check-in.";
    if (isRoom && Number(form.guests) > maxGuests * Number(form.rooms))
      return `This room sleeps up to ${maxGuests} guests. Add another room for a larger group.`;
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const { data } = await API.post("/bookings", {
        kind,
        roomId: isRoom ? item._id : undefined,
        transportId: isRoom ? undefined : item._id,
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        rooms: units,
        notes: form.notes.trim(),
      });

      onSuccess?.(data);
    } catch (err) {
      setError(getErrorMessage(err, "Could not complete the booking."));
    } finally {
      setSubmitting(false);
    }
  };

  if (disabled) {
    return (
      <div className="rounded-xl bg-slate-50 p-5 text-center">
        <Lock className="mx-auto h-5 w-5 text-slate-400" />
        <p className="mt-2 text-sm font-semibold text-slate-700">
          Not available right now
        </p>
        <p className="mt-1 text-xs text-slate-500">
          This {isRoom ? "room" : "vehicle"} is currently booked. Call us and
          we'll find you an alternative.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label" htmlFor="bf-checkIn">
            {isRoom ? "Check in" : "From"}
          </label>
          <input
            id="bf-checkIn"
            type="date"
            name="checkIn"
            min={todayInput()}
            value={form.checkIn}
            onChange={handleChange}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="bf-checkOut">
            {isRoom ? "Check out" : "To"}
          </label>
          <input
            id="bf-checkOut"
            type="date"
            name="checkOut"
            min={addDaysInput(form.checkIn || todayInput(), 1)}
            value={form.checkOut}
            onChange={handleChange}
            className="field-input"
          />
        </div>
      </div>

      <div className={`grid gap-3 ${isRoom ? "grid-cols-2" : "grid-cols-1"}`}>
        <div>
          <label className="field-label" htmlFor="bf-guests">
            Guests
          </label>
          <select
            id="bf-guests"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            className="field-input"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} guest{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {isRoom && (
          <div>
            <label className="field-label" htmlFor="bf-rooms">
              Rooms
            </label>
            <select
              id="bf-rooms"
              name="rooms"
              value={form.rooms}
              onChange={handleChange}
              className="field-input"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} room{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div>
          <label className="field-label" htmlFor="bf-name">
            Full name
          </label>
          <input
            id="bf-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="field-input"
            autoComplete="name"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="bf-mobile">
              Mobile
            </label>
            <input
              id="bf-mobile"
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10-digit number"
              maxLength={10}
              className="field-input"
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="bf-email">
              Email
            </label>
            <input
              id="bf-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="field-input"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="bf-notes">
            Anything we should know? (optional)
          </label>
          <textarea
            id="bf-notes"
            name="notes"
            rows={2}
            value={form.notes}
            onChange={handleChange}
            placeholder="Late arrival, extra mattress, pick-up needed…"
            className="field-input resize-none"
          />
        </div>
      </div>

      {/* Price summary */}
      {nights > 0 && (
        <div className="space-y-1.5 rounded-xl bg-sand-100 p-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>
              {formatCurrency(unitPrice)} × {nights}{" "}
              {isRoom ? "night" : "day"}
              {nights > 1 ? "s" : ""}
              {units > 1 ? ` × ${units} rooms` : ""}
            </span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-300/60 pt-1.5 font-semibold text-slate-900">
            <span>Total payable</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming…
          </>
        ) : (
          <>
            <CalendarCheck className="h-4 w-4" />
            Request booking
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-500">
        No payment now — we'll call you to confirm.
      </p>
    </form>
  );
};

export default BookingForm;
