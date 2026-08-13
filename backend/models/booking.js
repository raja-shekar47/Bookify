const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // "room" bookings reference a Room, "transport" bookings reference a Transport
    kind: {
      type: String,
      enum: ["room", "transport"],
      default: "room",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    transport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
    },
    // Snapshot of the item title so bookings stay readable if the item is deleted
    itemTitle: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },
    rooms: {
      type: Number,
      default: 1,
      min: 1,
    },
    nights: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    reference: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Human friendly booking reference, e.g. AS-7K2M9Q.
// Mixes the clock with randomness so two bookings made in the same second
// still can't collide on the unique index.
bookingSchema.pre("validate", function assignReference() {
  if (!this.reference) {
    const time = Date.now().toString(36).slice(-3).toUpperCase();
    const random = Math.random().toString(36).slice(2, 5).toUpperCase();
    this.reference = `AS-${time}${random}`;
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
