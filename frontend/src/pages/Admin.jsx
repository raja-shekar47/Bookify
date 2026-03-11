import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function AddRoom() {
  const [room, setRoom] = useState({
    image: "",
    title: "",
    price: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!room.image || !room.title || !room.price || !room.address) {
      return "All fields are required.";
    }

    if (isNaN(room.price)) {
      return "Price must be a number.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/rooms", {
        ...room,
        price: Number(room.price),
      });

      alert("Room Added Successfully ✅");

      // Reset form
      setRoom({
        image: "",
        title: "",
        price: "",
        address: "",
      });
    } catch (err) {
      console.error("Error adding room:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };   

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <Link to="/">
        <button className="absolute top-4 left-4 mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          <span className="text-sm font-medium text-gray-700 text-white">
            Back to Home
          </span>
        </button>
      </Link>

      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add New Room
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={room.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Room Title
            </label>
            <input
              type="text"
              name="title"
              value={room.title}
              onChange={handleChange}
              placeholder="Deluxe Mountain View"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={room.price}
              onChange={handleChange}
              placeholder="2500"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={room.address}
              onChange={handleChange}
              placeholder="Ooty, Tamil Nadu"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-semibold transition-all duration-300
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
          >
            {loading ? "Adding Room..." : "Add Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRoom;
