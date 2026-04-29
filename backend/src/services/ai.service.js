// src/services/ai.service.js
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS DOES:
//   Sends the uploaded video file to the Python AI microservice (FastAPI)
//   and returns the deepfake prediction result.
//
// WHY A SEPARATE SERVICE?
//   Node.js cannot run TensorFlow/PyTorch models.
//   The AI student runs their own Python FastAPI server.
//   This file is the "bridge" — it sends the video over HTTP and gets back JSON.
//
// EXPECTED PYTHON ENDPOINT:
//   POST http://localhost:8000/predict
//   Body: multipart/form-data  →  field name "video"
//   Response: { "label": "REAL" | "FAKE", "confidence": 94.6 }
//
// WHAT THIS RETURNS TO THE CONTROLLER:
//   { label: "REAL", confidence: 94.6 }
// ─────────────────────────────────────────────────────────────────────────────

const axios    = require("axios");
const FormData = require("form-data");
const fs       = require("fs");
const path     = require("path");

const AI_BASE_URL = process.env.PYTHON_AI_URL || "http://localhost:8000";

/**
 * Sends a video file to the Python AI service and returns the prediction.
 *
 * @param {string} filePath - Absolute path of the uploaded video on disk
 * @returns {Promise<{ label: string, confidence: number }>}
 */
async function analyzeVideo(filePath) {

  // Build multipart/form-data with the video file attached
  const form = new FormData();
  form.append("video", fs.createReadStream(filePath), {
    filename:    path.basename(filePath),
    contentType: "video/mp4",
  });

  let response;

  try {
    response = await axios.post(`${AI_BASE_URL}/predict`, form, {
      headers: {
        ...form.getHeaders(), // Sets correct Content-Type with boundary
      },
      timeout:          120_000, // 2 minutes — DL inference takes time
      maxContentLength: Infinity,
      maxBodyLength:    Infinity,
    });

  } catch (err) {
    // Give useful error codes so the controller can return helpful messages
    if (err.code === "ECONNREFUSED") {
      const e = new Error("Python AI service is not running or not reachable.");
      e.code  = "AI_OFFLINE";
      throw e;
    }
    if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      const e = new Error("Python AI service timed out.");
      e.code  = "AI_TIMEOUT";
      throw e;
    }
    throw err; // Unknown error — bubble it up
  }

  // Validate that the Python service returned the expected shape
  const { label, confidence } = response.data;

  if (!label || typeof confidence !== "number") {
    throw new Error(
      `Unexpected AI response format: ${JSON.stringify(response.data)}. ` +
      `Expected: { label: "REAL"|"FAKE", confidence: 94.6 }`
    );
  }

  return {
    label:      label.toUpperCase().trim(), // Normalize: "real" → "REAL"
    confidence: parseFloat(confidence.toFixed(2)),
  };
}

module.exports = { analyzeVideo };