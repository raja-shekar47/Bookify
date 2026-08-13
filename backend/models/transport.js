const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Hatchback", "Sedan", "SUV", "Tempo Traveller", "Jeep", "Bike"],
      default: "Sedan",
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    seats: {
      type: Number,
      default: 4,
      min: 1,
    },
    ac: {
      type: Boolean,
      default: true,
    },
    driverName: {
      type: String,
      default: "",
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
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

module.exports = mongoose.model("Transport", transportSchema);
