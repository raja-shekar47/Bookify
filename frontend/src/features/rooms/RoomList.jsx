import React, { useEffect, useState } from "react";
import API from "../../services/api";
import BookingSearch from "../booking/BookingSearch";
import { Link } from "react-router-dom";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    API.get("/rooms").then((res) => setRooms(res.data));
  }, []);

    if (rooms.length === 0) return <div>Loading...</div>;
    
    console.log("first", rooms)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-6">
        <BookingSearch />
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Cottages</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={room.image}
                alt={room.title}
                className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-green-600 shadow">
                ₹{room.price}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {room.title}
              </h3>

              <p className="text-sm text-gray-500">{room.address}</p>

              <Link to={`/rooms/${room._id}`}>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition duration-200">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
