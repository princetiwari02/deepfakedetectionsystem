// src/routes/contact.routes.js
// ─────────────────────────────────────────────────────────────────────────────
// Public route — no auth required for contact form submissions.
// POST /api/contact  → save message to MongoDB
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router  = express.Router();
const { handleContact } = require("../controllers/contact.controller");

// POST /api/contact  — public, no auth needed
router.post("/", handleContact);

module.exports = router;