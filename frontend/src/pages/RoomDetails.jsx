import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

const RoomDetails = () => {
  const { roomId } = useParams();

  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <Link
        to="/"
        className="inline-block mb-4 absolute -top-3 -left-3 inline-block"
      >
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

          <p className="text-gray-600">{roomDetails.description}</p>

          <p className="text-xl font-semibold">
            ₹{roomDetails.price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
