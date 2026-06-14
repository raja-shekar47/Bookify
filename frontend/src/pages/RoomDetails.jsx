import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

const RoomDetails = () => {
  const { roomId } = useParams();

  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchData, setSearchData] = useState();
  const handleSearch = (data) => {
    setSearchData(data);
  };

  const [isBooking, setIsBooking] = useState(false); 

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await API.get(`/rooms/${roomId}`);
        setRoomDetails(data);
      } catch (err) {
        console.error("Error fetching room details:", err);
        setError("Failed to load room details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const handleBookRoom = () => {
    setIsBooking(true);
  };

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    console.log("Booking Data:", bookingData);

    alert("Booking Confirmed!");

    setIsBooking(false);

    // Here you can call booking API
    // API.post("/bookings", bookingData)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading room details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!roomDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-900">Room not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 relative">
      <Link to="/" className="inline-block mb-4 absolute -top-3 -left-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
          Go Home
        </button>
      </Link>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <img
          src={roomDetails.image}
          alt={roomDetails.name}
          className="w-full h-96 object-cover"
        />

        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {roomDetails.name}
          </h1>

          <p className="text-gray-600">{roomDetails.title}</p>

          <p className="text-gray-600">{roomDetails.description}</p>

          <p className="text-xl font-semibold">₹{roomDetails.price}</p>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-3 w-full hover:bg-blue-700 transition duration-200"
          onClick={handleBookRoom}
        >
          Book Now
        </button>
      </div>

      {/* Booking Modal */}
      {/* Booking Form Section */}
      {isBooking && (
        <div className="mt-8 bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Room Booking</h2>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={bookingData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Mobile */}
            <input
              type="tel"
              name="mobile"
              placeholder="Enter mobile number"
              value={bookingData.mobile}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={bookingData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Date */}
            <input
              type="date"
              name="date"
              value={bookingData.date}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Number of Rooms */}
            <input
              type="number"
              name="rooms"
              placeholder="Number of Rooms"
              min="1"
              value={bookingData.rooms}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Room Type */}
            <select
              name="roomType"
              value={bookingData.roomType}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AC">AC Room</option>
              <option value="Non-AC">Non-AC Room</option>
            </select>

            {/* Confirm Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
