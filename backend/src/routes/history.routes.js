// src/routes/history.routes.js
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS DOES:
//   Defines all history-related API routes.
//   All routes require authentication (user must be signed in).
//
// ROUTES:
//   GET    /api/history           → Get paginated history list
//   GET    /api/history/stats     → Get summary stats (total, fake, real)
//   DELETE /api/history/:id       → Delete one specific analysis record
//   DELETE /api/history           → Delete ALL records for the user
// ─────────────────────────────────────────────────────────────────────────────

const express        = require("express");
const router         = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  getHistory,
  getStats,
  deleteOne,
  clearAll,
} = require("../controllers/history.controller");

// All history routes require the user to be logged in
router.use(authMiddleware);

// GET  /api/history          → paginated list of user's analyses
// Query params: ?limit=50&page=1
router.get("/", getHistory);

// GET  /api/history/stats    → { total, fakeCount, realCount, avgConfidence }
// NOTE: This route MUST be defined BEFORE /:id so Express doesn't
//       treat "stats" as an :id parameter
router.get("/stats", getStats);

// DELETE /api/history        → clear ALL records for logged-in user
router.delete("/", clearAll);

// DELETE /api/history/:id    → delete ONE record by MongoDB _id
router.delete("/:id", deleteOne);

module.exports = router;