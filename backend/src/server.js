// src/server.js
// ─────────────────────────────────────────────────────────────────────────────
// ENTRY POINT — Run this file to start the backend server.
//
// STARTUP ORDER (important — do not change):
//   1. Load .env variables
//   2. Connect to MongoDB Atlas
//   3. Initialize Firebase Admin SDK
//   4. Start Express server
//
// How to start:
//   Development:  npm run dev   (auto-restarts on file changes via nodemon)
//   Production:   npm start
// ─────────────────────────────────────────────────────────────────────────────

// Step 1 — Load environment variables FIRST — before any other imports
require("dotenv").config();

// Step 2 — Connect to MongoDB Atlas
const connectDB = require("./config/db");

// Step 3 — Initialize Firebase Admin SDK
require("./config/firebase");

// Step 4 — Import Express app
const app  = require("./app");
const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║     DeepGuard AI — Backend Server      ║");
    console.log("╚════════════════════════════════════════╝");
    console.log(`🚀  Server running on   http://localhost:${PORT}`);
    console.log(`🩺  Health check at     http://localhost:${PORT}/api/health`);
    console.log(`🌍  Environment         ${process.env.NODE_ENV || "development"}`);
    console.log(`🤖  AI service URL      ${process.env.PYTHON_AI_URL || "http://localhost:8000"}`);
    console.log("─────────────────────────────────────────\n");
  });

  // Handle unexpected crashes gracefully
  process.on("unhandledRejection", (err) => {
    console.error("💥  Unhandled Promise Rejection:", err.message);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (err) => {
    console.error("💥  Uncaught Exception:", err.message);
    process.exit(1);
  });
});