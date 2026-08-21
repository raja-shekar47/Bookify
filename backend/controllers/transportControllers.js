const Transport = require("../models/transport");

// Create Transport
exports.createTransport = async (req, res) => {
  try {
    const transport = await Transport.create(req.body);
    res.status(201).json(transport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Transports — supports ?status=available&type=SUV
exports.getTransports = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

    const transports = await Transport.find(filter).sort({ createdAt: -1 });
    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Transport By ID
exports.getTransportById = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);

    if (!transport) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Transport
exports.updateTransport = async (req, res) => {
  try {
    const transport = await Transport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!transport) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(transport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Transport
exports.deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findByIdAndDelete(req.params.id);

    if (!transport) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
