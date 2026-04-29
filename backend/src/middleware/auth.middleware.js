// src/middleware/auth.middleware.js
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS DOES:
//   Protects all API routes. Every request must include a valid Firebase token.
//   If the token is missing or invalid → respond 401 Unauthorized immediately.
//   If the token is valid → attach req.user = { uid, email } and continue.
//
// HOW THE FRONTEND SENDS THE TOKEN:
//   Authorization: Bearer <Firebase ID Token>
//
// HOW TO USE THIS MIDDLEWARE:
//   Add it to any route that requires login:
//   router.post("/analyze", authMiddleware, uploadMiddleware, handleAnalyze)
// ─────────────────────────────────────────────────────────────────────────────

const admin = require("../config/firebase");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Step 1 — Check the Authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized: No token provided.",
      hint:  "Send header →  Authorization: Bearer <Firebase ID Token>",
    });
  }

  // Step 2 — Extract the token from "Bearer <token>"
  const idToken = authHeader.split("Bearer ")[1];

  // Step 3 — Verify with Firebase (checks signature + expiry)
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Attach user info to request — controllers can use req.user
    req.user = {
      uid:   decoded.uid,
      email: decoded.email || "unknown",
    };

    next(); // ✅ Token valid — proceed to next middleware / controller

  } catch (err) {
    console.warn("⚠️   Token verification failed:", err.message);
    return res.status(401).json({
      error: "Unauthorized: Invalid or expired token. Please sign in again.",
    });
  }
}

module.exports = authMiddleware;