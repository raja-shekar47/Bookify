const Room = require("../models/room");

// Create Room
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Rooms — supports ?status=available&guests=2&maxPrice=3000
exports.getRooms = async (req, res) => {
  try {
    const { status, guests, maxPrice, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (guests) filter.maxGuests = { $gte: Number(guests) };
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (search) filter.title = { $regex: search, $options: "i" };

    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Room By ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Room
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
