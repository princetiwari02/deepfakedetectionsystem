// src/utils/cleanup.js
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS DOES:
//   Deletes uploaded video files from disk after they've been analyzed.
//   This ensures NO video is ever permanently stored on this server.
//
// HOW TO USE:
//   Always call this in the controller's finally{} block so it runs
//   whether the analysis succeeded OR failed.
//
//   Example:
//     try {
//       const result = await analyzeVideo(req.file.path);
//       res.json(result);
//     } catch (err) {
//       res.status(500).json({ error: "..." });
//     } finally {
//       deleteFile(req.file.path); // ← always runs
//     }
// ─────────────────────────────────────────────────────────────────────────────

const fs   = require("fs");
const path = require("path");

/**
 * Deletes a file from disk silently.
 * @param {string} filePath - Absolute path to the file to delete
 */
function deleteFile(filePath) {
  if (!filePath) return;

  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      // ENOENT means file was already gone — that's fine, ignore it
      console.error(`⚠️   Could not delete temp file: ${filePath}`, err.message);
    } else if (!err) {
      console.log(`🗑   Deleted temp file: ${path.basename(filePath)}`);
    }
  });
}

module.exports = { deleteFile };