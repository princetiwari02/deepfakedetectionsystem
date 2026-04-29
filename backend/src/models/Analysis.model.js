// src/models/Analysis.model.js
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS IS:
//   The MongoDB schema (blueprint) for storing deepfake analysis results.
//   Every time a user analyzes a video, one document is saved here.
//
// WHAT GETS STORED:
//   - Who ran it     (userId, userEmail — from Firebase token)
//   - What file      (filename, fileSize)
//   - What result    (label: REAL/FAKE, confidence score)
//   - When           (analyzedAt — auto timestamp)
//
// COLLECTION NAME:  "analyses"  (MongoDB auto-pluralises "Analysis")
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    // ── Who ran the analysis ─────────────────────────────────────
    userId: {
      type:     String,
      required: true,
      index:    true,   // Index for fast "get my history" queries
      trim:     true,
    },
    userEmail: {
      type:    String,
      default: "unknown",
      trim:    true,
    },

    // ── The video that was analyzed ──────────────────────────────
    filename: {
      type:     String,
      required: true,
      trim:     true,
    },
    fileSizeMB: {
      type:    Number,
      default: 0,
    },

    // ── The AI model's result ────────────────────────────────────
    label: {
      type:     String,
      required: true,
      enum:     ["REAL", "FAKE"],  // Only these two values allowed
    },
    confidence: {
      type:     Number,
      required: true,
      min:      0,
      max:      100,
    },

    // ── Extra status info ────────────────────────────────────────
    status: {
      type:    String,
      enum:    ["success", "error"],
      default: "success",
    },
    errorMessage: {
      type:    String,
      default: null,
    },
  },
  {
    // ── Mongoose options ─────────────────────────────────────────
    timestamps: true,         // Auto-adds createdAt + updatedAt fields
    collection:  "analyses",  // Explicit collection name in MongoDB
  }
);

// ── Index for "get all analyses by user, newest first" ────────────
// This makes the history page query very fast
analysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis = mongoose.model("Analysis", analysisSchema);

module.exports = Analysis;