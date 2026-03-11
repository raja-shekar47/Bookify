const Rooms = require("../models/room");

// Create Room
exports.createRoom = async (req, res) => {
  try {
    const room = await Rooms.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Room By ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Rooms.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
