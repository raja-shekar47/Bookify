const fs = require("fs");
const path = require("path");
const { UPLOAD_DIR } = require("../middleware/upload");

// POST /api/uploads  (admin) — field name: "image"
exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image was uploaded." });
  }

  // Stored relative so the DB stays portable across hosts; the frontend
  // resolves it against the API origin.
  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
    size: req.file.size,
  });
};

// DELETE /api/uploads/:filename  (admin)
exports.deleteUpload = async (req, res) => {
  try {
    // Guard against path traversal — only ever a bare filename.
    const filename = path.basename(req.params.filename);
    const target = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(target)) {
      return res.status(404).json({ message: "File not found" });
    }

    fs.unlinkSync(target);
    res.json({ message: "File deleted", filename });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
