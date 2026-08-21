const fs = require("fs");
const path = require("path");
const multer = require("multer");

const UPLOAD_DIR = path.join(__dirname, "..", "public", "uploads");

// multer won't create the folder itself
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const slug = path
      .basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);

    cb(null, `${slug || "image"}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      // Tag it so the central error handler answers 400, not 500.
      const error = new Error(
        "Only JPG, PNG, WebP or AVIF images can be uploaded.",
      );
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

module.exports = upload;
module.exports.UPLOAD_DIR = UPLOAD_DIR;
