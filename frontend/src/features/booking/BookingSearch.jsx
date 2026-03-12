import React from "react";
import { useState } from "react";

const BookingSearch = () => {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1,
  });
  const [bookings, setBookings] = useState([]);

  const handleFormSubmit = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setBookings((prev) => [...prev, formData]);
    console.log("All bookings:", [...bookings, formData]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {/* Check-in */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Check In
          </label>
          <input
            name="checkIn"
            type="date"
            value={formData.checkIn}
            onChange={handleFormSubmit}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        {/* Check-out */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Check Out
          </label>
          <input
            name="checkOut"
            type="date"
            value={formData.checkOut}
            onChange={handleFormSubmit}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        {/* Guests */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Guests
          </label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleFormSubmit}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Adult{num > 1 && "s"}
              </option>
            ))}
          </select>
        </div>

        {/* Rooms */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Rooms
          </label>
          <select
            name="rooms"
            value={formData.rooms}
            onChange={handleFormSubmit}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} Room{num > 1 && "s"}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-3 transition duration-300 shadow-lg"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default BookingSearch;
