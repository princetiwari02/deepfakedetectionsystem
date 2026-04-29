// src/app.js
// ─────────────────────────────────────────────────────────────────────────────
// Sets up the Express application:
//   - Security headers  (helmet)
//   - Request logging   (morgan)
//   - CORS              (allows frontend to call backend)
//   - Rate limiting     (prevents abuse)
//   - JSON parsing
//   - All routes:  analyze + history + contact
//   - Global error handler
// ─────────────────────────────────────────────────────────────────────────────

const express        = require("express");
const cors           = require("cors");
const helmet         = require("helmet");
const morgan         = require("morgan");
const rateLimit      = require("express-rate-limit");

const analyzeRoutes  = require("./routes/analyze.routes");
const historyRoutes  = require("./routes/history.routes");
const contactRoutes  = require("./routes/contact.routes");

const app = express();

// ── 1. Security headers ───────────────────────────────────────────
app.use(helmet());

// ── 2. Request logging ────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ── 3. CORS ───────────────────────────────────────────────────────
// Allow frontend (localhost:3000 in dev, production URL in prod)
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({
  origin:         allowedOrigin,
  methods:        ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials:    true,
}));

console.log(`🌐  CORS allowed for: ${allowedOrigin}`);

// ── 4. Rate Limiting ──────────────────────────────────────────────

// Analysis endpoint: 20 requests per 15 min per IP
const analyzeLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             20,
  message:         { error: "Too many requests. Please wait a few minutes before trying again." },
  standardHeaders: true,
  legacyHeaders:   false,
});

// History endpoints: 100 requests per 15 min
const historyLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             100,
  message:         { error: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders:   false,
});

// Contact form: 10 submissions per hour per IP (prevent spam)
const contactLimiter = rateLimit({
  windowMs:        60 * 60 * 1000, // 1 hour
  max:             10,
  message:         { error: "Too many contact submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders:   false,
});

app.use("/api/analyze", analyzeLimiter);
app.use("/api/history", historyLimiter);
app.use("/api/contact", contactLimiter);

// ── 5. Body parsers ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── 6. Routes ─────────────────────────────────────────────────────
// POST   /api/analyze           → deepfake detection
// GET    /api/health            → health check (public)
// GET    /api/history           → paginated history list
// GET    /api/history/stats     → summary stats
// DELETE /api/history/:id       → delete one record
// DELETE /api/history           → clear all records
// POST   /api/contact           → contact form submission (public)
app.use("/api",          analyzeRoutes);
app.use("/api/history",  historyRoutes);
app.use("/api/contact",  contactRoutes);

// ── 7. 404 handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.path}`,
    hint:  "Available: POST /api/analyze | GET /api/health | GET /api/history | GET /api/history/stats | POST /api/contact",
  });
});

// ── 8. Global error handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("⚠️   Unhandled error:", err.message);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: `File too large. Maximum allowed size is ${process.env.MAX_FILE_SIZE_MB || 100}MB.`,
    });
  }

  if (err.message?.includes("Unsupported format")) {
    return res.status(415).json({ error: err.message });
  }

  res.status(500).json({ error: "An unexpected server error occurred." });
});

module.exports = app;