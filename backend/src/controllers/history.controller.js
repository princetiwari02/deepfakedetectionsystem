// src/controllers/history.controller.js
// ─────────────────────────────────────────────────────────────────────────────
// Handles all history-related endpoints:
//   GET    /api/history           → paginated history list
//   GET    /api/history/stats     → summary stats (total, fake, real, avg)
//   DELETE /api/history/:id       → delete one record
//   DELETE /api/history           → clear all records
//
// All routes require auth middleware — users only see their OWN data.
// ─────────────────────────────────────────────────────────────────────────────

const {
  getUserHistory,
  getUserStats,
  deleteAnalysis,
  clearUserHistory,
} = require("../services/db.service");

// ── GET /api/history ──────────────────────────────────────────────────────────
// Returns paginated history for the logged-in user, newest first.
// Supports: ?limit=50&page=1
async function getHistory(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const page  = Math.max(parseInt(req.query.page)  || 1,  1);

    const data = await getUserHistory(req.user.uid, limit, page);

    return res.status(200).json({
      analyses:   data.analyses,
      total:      data.total,
      page:       data.page,
      totalPages: data.totalPages,
      limit,
    });

  } catch (err) {
    console.error("❌  getHistory error:", err.message);
    return res.status(500).json({ error: "Failed to fetch history." });
  }
}

// ── GET /api/history/stats ────────────────────────────────────────────────────
// Returns: { total, fakeCount, realCount, avgConfidence }
// Used for the summary pills on the HistoryPage.
async function getStats(req, res) {
  try {
    const stats = await getUserStats(req.user.uid);
    return res.status(200).json(stats);
  } catch (err) {
    console.error("❌  getStats error:", err.message);
    return res.status(500).json({ error: "Failed to fetch stats." });
  }
}

// ── DELETE /api/history/:id ───────────────────────────────────────────────────
// Deletes ONE analysis record by MongoDB _id.
// Only succeeds if the record belongs to the logged-in user.
async function deleteOne(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Analysis ID is required." });
  }

  try {
    const deleted = await deleteAnalysis(id, req.user.uid);

    if (!deleted) {
      return res.status(404).json({
        error: "Record not found or you do not have permission to delete it.",
      });
    }

    return res.status(200).json({
      message:   "Analysis record deleted successfully.",
      deletedId: id,
    });

  } catch (err) {
    console.error("❌  deleteOne error:", err.message);
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid analysis ID format." });
    }
    return res.status(500).json({ error: "Failed to delete record." });
  }
}

// ── DELETE /api/history ───────────────────────────────────────────────────────
// Deletes ALL analysis records for the logged-in user.
async function clearAll(req, res) {
  try {
    const count = await clearUserHistory(req.user.uid);
    return res.status(200).json({
      message:      `Cleared ${count} analysis record${count !== 1 ? "s" : ""}.`,
      deletedCount: count,
    });
  } catch (err) {
    console.error("❌  clearAll error:", err.message);
    return res.status(500).json({ error: "Failed to clear history." });
  }
}

module.exports = { getHistory, getStats, deleteOne, clearAll };