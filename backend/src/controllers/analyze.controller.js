// src/controllers/analyze.controller.js
// ─────────────────────────────────────────────────────────────────────────────
// Handles POST /api/analyze — the main deepfake detection endpoint.
// Auth + upload middleware have already run before this controller.
//
// FLOW:
//   1. Log the request
//   2. Send video to Python AI service
//   3. Save result to MongoDB Atlas
//   4. Return result (REAL/FAKE + confidence) as JSON
//   5. ALWAYS delete the temp video file
// ─────────────────────────────────────────────────────────────────────────────

const { analyzeVideo } = require("../services/ai.service");
const { saveAnalysis } = require("../services/db.service");
const { deleteFile }   = require("../utils/cleanup");

async function handleAnalyze(req, res) {
  const filePath = req.file?.path;

  if (!req.file) {
    return res.status(400).json({ error: "No video file was received." });
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📥  New Analysis Request");
  console.log(`    User     : ${req.user.email} (${req.user.uid})`);
  console.log(`    File     : ${req.file.originalname}`);
  console.log(`    Size     : ${(req.file.size / 1048576).toFixed(2)} MB`);
  console.log(`    Saved as : ${req.file.filename}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    // ── Step 1: Send video to Python AI service ───────────────────
    const result = await analyzeVideo(filePath);
    console.log(`✅  Result: ${result.label} | Confidence: ${result.confidence}%`);

    // ── Step 2: Save result to MongoDB Atlas ──────────────────────
    let savedDoc = null;
    try {
      savedDoc = await saveAnalysis({
        userId:     req.user.uid,
        userEmail:  req.user.email,
        filename:   req.file.originalname,
        fileSizeMB: parseFloat((req.file.size / 1048576).toFixed(2)),
        label:      result.label,
        confidence: result.confidence,
      });
    } catch (dbErr) {
      console.error("⚠️   MongoDB save failed (non-critical):", dbErr.message);
    }

    // ── Step 3: Respond to frontend ───────────────────────────────
    // Shape matches exactly what AnalyzePage.jsx and HistoryPage.jsx expect
    return res.status(200).json({
      label:       result.label,              // "REAL" or "FAKE"
      confidence:  result.confidence,         // e.g. 94.6
      filename:    req.file.originalname,     // original file name
      analyzedAt:  new Date().toISOString(),  // ISO timestamp
      userId:      req.user.uid,              // Firebase UID
      recordId:    savedDoc?._id ?? null,     // MongoDB _id
      // Also include _id and createdAt to match history list shape
      _id:         savedDoc?._id ?? null,
      createdAt:   savedDoc?.createdAt ?? new Date().toISOString(),
    });

  } catch (err) {
    console.error("❌  Analysis error:", err.message);

    if (err.code === "AI_OFFLINE") {
      return res.status(503).json({
        error: "The AI service is currently unavailable. Please try again later.",
      });
    }
    if (err.code === "AI_TIMEOUT") {
      return res.status(504).json({
        error: "Analysis timed out. The video may be too long. Please try a shorter clip.",
      });
    }

    return res.status(500).json({
      error: "Analysis failed due to a server error. Please try again.",
    });

  } finally {
    // ALWAYS delete uploaded video — we promised "No video stored permanently"
    deleteFile(filePath);
  }
}

module.exports = { handleAnalyze };