// src/routes/analyze.routes.js
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS DOES:
//   Defines all API routes for this backend.
//   Each route chains middleware in order:
//     authMiddleware   → verifies user is logged in
//     upload.single()  → handles file upload + validates type/size
//     handleAnalyze    → runs the analysis and sends response
//
// ROUTES:
//   POST /api/analyze   → main deepfake detection endpoint
//   GET  /api/health    → quick check to confirm the server is running
// ─────────────────────────────────────────────────────────────────────────────

const express        = require("express");
const router         = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const upload         = require("../middleware/upload.middleware");
const { handleAnalyze } = require("../controllers/analyze.controller");

// ── POST /api/analyze ─────────────────────────────────────────────
// Protected: user must be logged in (Firebase token required)
// Accepts:   multipart/form-data with field name "video"
// Returns:   { label, confidence, filename, analyzedAt, userId }
router.post(
  "/analyze",
  authMiddleware,          // Step 1: verify Firebase token
  upload.single("video"),  // Step 2: save file, validate type+size
  handleAnalyze            // Step 3: call AI service, return result
);

// ── GET /api/health ───────────────────────────────────────────────
// Public: no auth needed — used to check if server is alive
// The frontend or any tool (Postman, browser) can call this
router.get("/health", (req, res) => {
  res.status(200).json({
    status:    "ok",
    service:   "DeepGuard AI Backend",
    timestamp: new Date().toISOString(),
    uptime:    `${Math.floor(process.uptime())}s`,
  });
});

module.exports = router;