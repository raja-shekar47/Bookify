const Booking = require("../models/booking");
const Room = require("../models/room");
const Transport = require("../models/transport");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const nightsBetween = (checkIn, checkOut) => {
  const diff = Math.ceil((checkOut - checkIn) / MS_PER_DAY);
  return diff > 0 ? diff : 1;
};

// Create Booking (room or transport)
exports.createBooking = async (req, res) => {
  try {
    const {
      kind = "room",
      roomId,
      transportId,
      name,
      mobile,
      email,
      checkIn,
      checkOut,
      guests = 1,
      rooms = 1,
      notes = "",
    } = req.body;

    if (!name || !mobile || !email || !checkIn || !checkOut) {
      return res.status(400).json({
        message: "Name, mobile, email, check-in and check-out are required.",
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid dates supplied." });
    }

    if (end <= start) {
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in." });
    }

    const nights = nightsBetween(start, end);
    let itemTitle = "";
    let unitPrice = 0;
    const payload = { kind };

    if (kind === "transport") {
      const transport = await Transport.findById(transportId);
      if (!transport) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      if (transport.status !== "available") {
        return res
          .status(409)
          .json({ message: "This vehicle is not available right now." });
      }
      payload.transport = transport._id;
      itemTitle = transport.name;
      unitPrice = transport.pricePerDay;
    } else {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      if (room.status !== "available") {
        return res
          .status(409)
          .json({ message: "This room is not available right now." });
      }
      payload.room = room._id;
      itemTitle = room.title;
      unitPrice = room.price;
    }

    const unitCount = kind === "transport" ? 1 : Number(rooms) || 1;
    const totalAmount = unitPrice * nights * unitCount;

    const booking = await Booking.create({
      ...payload,
      itemTitle,
      name,
      mobile,
      email,
      checkIn: start,
      checkOut: end,
      guests: Number(guests) || 1,
      rooms: unitCount,
      nights,
      totalAmount,
      notes,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Bookings — supports ?kind=room&status=pending&email=...
exports.getBookings = async (req, res) => {
  try {
    const { kind, status, email } = req.query;
    const filter = {};

    if (kind) filter.kind = kind;
    if (status) filter.status = status;
    if (email) filter.email = email.toLowerCase();

    const bookings = await Booking.find(filter)
      .populate("room", "title image price")
      .populate("transport", "name image pricePerDay")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Booking By Reference (guest lookup — no auth needed)
exports.getBookingByReference = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      reference: req.params.reference.toUpperCase(),
    })
      .populate("room", "title image price address")
      .populate("transport", "name image pricePerDay contactNumber");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Booking status (admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid booking status." });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Booking (admin)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
