import { useState } from "react";
import { CalendarDays, Search, Users, BedDouble } from "lucide-react";
import { useSearch } from "../../context/searchStore";
import { addDaysInput, nightsBetween, todayInput } from "../../utils/format";

/**
 * Stay search bar. Writes straight into the shared search context so the
 * room list and booking form pick the same dates up.
 */
const BookingSearch = ({ buttonLabel = "Search rooms", onSearch }) => {
  const { criteria, setCriteria } = useSearch();
  // This bar is the only writer of the shared criteria, so seeding once is enough.
  const [form, setForm] = useState(criteria);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      // Keep check-out strictly after check-in.
      if (name === "checkIn" && next.checkOut <= value) {
        next.checkOut = addDaysInput(value, 1);
      }
      return next;
    });
    setError("");
  };

  const nights = nightsBetween(form.checkIn, form.checkOut);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.checkIn || !form.checkOut) {
      setError("Pick both a check-in and a check-out date.");
      return;
    }
    if (nights < 1) {
      setError("Check-out has to be at least one night after check-in.");
      return;
    }

    const payload = {
      ...form,
      guests: Number(form.guests),
      rooms: Number(form.rooms),
    };
    setCriteria(payload);
    onSearch?.(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface w-full p-4 sm:p-5"
      noValidate
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
        {/* Check-in */}
        <div>
          <label className="field-label" htmlFor="checkIn">
            <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
            Check in
          </label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            min={todayInput()}
            value={form.checkIn}
            onChange={handleChange}
            className="field-input"
          />
        </div>

        {/* Check-out */}
        <div>
          <label className="field-label" htmlFor="checkOut">
            <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
            Check out
          </label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            min={addDaysInput(form.checkIn || todayInput(), 1)}
            value={form.checkOut}
            onChange={handleChange}
            className="field-input"
          />
        </div>

        {/* Guests */}
        <div>
          <label className="field-label" htmlFor="guests">
            <Users className="mr-1 inline h-3.5 w-3.5" />
            Guests
          </label>
          <select
            id="guests"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            className="field-input"
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
              <option key={num} value={num}>
                {num} guest{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Rooms */}
        <div>
          <label className="field-label" htmlFor="rooms">
            <BedDouble className="mr-1 inline h-3.5 w-3.5" />
            Rooms
          </label>
          <select
            id="rooms"
            name="rooms"
            value={form.rooms}
            onChange={handleChange}
            className="field-input"
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} room{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary h-[46px] lg:px-7">
          <Search className="h-4 w-4" />
          {buttonLabel}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        {nights > 0 && (
          <span className="font-medium text-slate-500">
            {nights} night{nights > 1 ? "s" : ""} selected
          </span>
        )}
        {error && <span className="font-medium text-rose-600">{error}</span>}
      </div>
    </form>
  );
};

export default BookingSearch;
