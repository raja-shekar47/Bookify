const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadImage, deleteUpload } = require("../controllers/uploadControllers");
const { adminOnly } = require("../middleware/authMiddleware");

router.post("/", adminOnly, upload.single("image"), uploadImage);
router.delete("/:filename", adminOnly, deleteUpload);

module.exports = router;
