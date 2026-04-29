// src/services/db.service.js
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS DOES:
//   All MongoDB database operations for this app — in one clean file.
//   The controller calls these functions instead of talking to MongoDB directly.
//   This keeps the controller clean and makes the DB logic easy to change.
//
// FUNCTIONS:
//   saveAnalysis(data)            → Save a new analysis result to MongoDB
//   getUserHistory(userId, limit) → Get a user's past analyses (newest first)
//   getUserStats(userId)          → Get summary stats (total, fake, real counts)
//   deleteAnalysis(id, userId)    → Delete one analysis (only owner can delete)
//   clearUserHistory(userId)      → Delete ALL analyses for a user
// ─────────────────────────────────────────────────────────────────────────────

const Analysis = require("../models/Analysis.model");

// ── Save a new analysis result ────────────────────────────────────────────────
/**
 * Creates and saves a new analysis document to MongoDB Atlas.
 * Called right after the AI service returns a successful prediction.
 *
 * @param {{ userId, userEmail, filename, fileSizeMB, label, confidence }} data
 * @returns {Promise<Analysis>} The saved MongoDB document
 */
async function saveAnalysis(data) {
  const doc = new Analysis({
    userId:     data.userId,
    userEmail:  data.userEmail  || "unknown",
    filename:   data.filename,
    fileSizeMB: data.fileSizeMB || 0,
    label:      data.label,       // "REAL" or "FAKE"
    confidence: data.confidence,  // e.g. 94.6
    status:     "success",
  });

  const saved = await doc.save();
  console.log(`💾  Saved to MongoDB: ${saved._id} (${saved.label})`);
  return saved;
}

// ── Get a user's analysis history ─────────────────────────────────────────────
/**
 * Returns a user's past analyses, sorted newest first.
 *
 * @param {string} userId  - Firebase UID
 * @param {number} limit   - Max results to return (default 50)
 * @param {number} page    - Page number for pagination (default 1)
 * @returns {Promise<{ analyses: Analysis[], total: number, totalPages: number }>}
 */
async function getUserHistory(userId, limit = 50, page = 1) {
  const skip = (page - 1) * limit;

  const [analyses, total] = await Promise.all([
    Analysis.find({ userId, status: "success" })
      .sort({ createdAt: -1 })   // Newest first
      .skip(skip)
      .limit(limit)
      .select("-__v"),            // Exclude internal Mongoose field
    Analysis.countDocuments({ userId, status: "success" }),
  ]);

  return {
    analyses,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ── Get stats summary for a user ──────────────────────────────────────────────
/**
 * Returns counts: total analyses, how many FAKE, how many REAL.
 * Used for the summary bar on the history page.
 *
 * @param {string} userId - Firebase UID
 * @returns {Promise<{ total, fakeCount, realCount, avgConfidence }>}
 */
async function getUserStats(userId) {
  const stats = await Analysis.aggregate([
    { $match: { userId, status: "success" } },
    {
      $group: {
        _id:           null,
        total:         { $sum: 1 },
        fakeCount:     { $sum: { $cond: [{ $eq: ["$label", "FAKE"] }, 1, 0] } },
        realCount:     { $sum: { $cond: [{ $eq: ["$label", "REAL"] }, 1, 0] } },
        avgConfidence: { $avg: "$confidence" },
      },
    },
  ]);

  // If no records yet, return zeros
  if (!stats.length) {
    return { total: 0, fakeCount: 0, realCount: 0, avgConfidence: 0 };
  }

  const s = stats[0];
  return {
    total:         s.total,
    fakeCount:     s.fakeCount,
    realCount:     s.realCount,
    avgConfidence: parseFloat((s.avgConfidence || 0).toFixed(1)),
  };
}

// ── Delete a single analysis ──────────────────────────────────────────────────
/**
 * Deletes one analysis by its MongoDB _id.
 * Only works if the analysis belongs to the requesting user (security check).
 *
 * @param {string} analysisId - MongoDB document _id
 * @param {string} userId     - Firebase UID (must match the saved userId)
 * @returns {Promise<boolean>} true if deleted, false if not found / not owner
 */
async function deleteAnalysis(analysisId, userId) {
  const result = await Analysis.findOneAndDelete({
    _id:    analysisId,
    userId: userId,      // ← Security: can only delete YOUR OWN records
  });

  return result !== null; // true = deleted, false = not found or not yours
}

// ── Clear all history for a user ──────────────────────────────────────────────
/**
 * Deletes ALL analysis records for a specific user.
 * Called when user clicks "Clear All History".
 *
 * @param {string} userId - Firebase UID
 * @returns {Promise<number>} Number of documents deleted
 */
async function clearUserHistory(userId) {
  const result = await Analysis.deleteMany({ userId });
  console.log(`🗑   Cleared ${result.deletedCount} records for user: ${userId}`);
  return result.deletedCount;
}

module.exports = {
  saveAnalysis,
  getUserHistory,
  getUserStats,
  deleteAnalysis,
  clearUserHistory,
};