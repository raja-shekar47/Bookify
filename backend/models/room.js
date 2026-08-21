const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["Standard Room", "Deluxe Room", "Family Suite", "Apartment"],
      default: "Standard Room",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    maxGuests: {
      type: Number,
      default: 2,
      min: 1,
    },
    beds: {
      type: Number,
      default: 1,
      min: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Room", roomSchema);
