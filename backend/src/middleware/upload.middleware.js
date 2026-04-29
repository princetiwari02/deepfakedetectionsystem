// src/middleware/upload.middleware.js
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS DOES:
//   Handles incoming video file uploads using Multer.
//   Validates file type (MP4 / AVI / MOV) and file size (max 40MB).
//   Saves file temporarily to /uploads folder with a unique name.
//   The controller will delete the file after analysis is done.
//
// HOW TO USE:
//   Add upload.single("video") to your route as middleware.
//   Then in the controller: req.file.path gives you the file path.
// ─────────────────────────────────────────────────────────────────────────────

const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

// How many MB is the max upload size
const MAX_MB     = parseInt(process.env.MAX_FILE_SIZE_MB || "40");

// Absolute path to the uploads folder (backend/uploads/)
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

// Make sure the folder exists — create it if not
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── 1. Storage Config ─────────────────────────────────────────────
// Tells Multer WHERE to save the file and WHAT to name it
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Save to /uploads
  },

  filename: (req, file, cb) => {
    // Unique name: userId_timestamp.extension
    // Example: abc123uid_1714000000000.mp4
    const uid = req.user?.uid || "unknown";
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uid}_${Date.now()}${ext}`);
  },

});

// ── 2. File Filter ────────────────────────────────────────────────
// Only accept MP4, AVI, and MOV — reject everything else
const ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/avi",
  "video/x-msvideo",  // .avi on some systems
  "video/quicktime",  // .mov
];
const ALLOWED_EXTENSIONS = [".mp4", ".avi", ".mov"];

const fileFilter = (req, file, cb) => {
  const ext  = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isValid = ALLOWED_MIME_TYPES.includes(mime) || ALLOWED_EXTENSIONS.includes(ext);

  if (isValid) {
    cb(null, true);  // ✅ Accept the file
  } else {
    cb(
      new Error(`Unsupported format: "${ext}". Only MP4, AVI, MOV are allowed.`),
      false           // ❌ Reject the file
    );
  }
};

// ── 3. Multer Instance ────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_MB * 1024 * 1024, // Convert MB to bytes
  },
});

module.exports = upload;