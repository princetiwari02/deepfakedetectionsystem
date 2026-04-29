// src/controllers/contact.controller.js
// ─────────────────────────────────────────────────────────────────────────────
// Handles POST /api/contact — saves contact form submission to MongoDB.
// This route is PUBLIC (no auth required) so anyone can contact us.
// ─────────────────────────────────────────────────────────────────────────────

const Contact = require("../models/Contact.model");

async function handleContact(req, res) {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required." });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required." });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  try {
    const doc = new Contact({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      subject: subject?.trim() || "General Inquiry",
      message: message.trim(),
    });

    const saved = await doc.save();

    console.log(`📬  New contact form submission from: ${saved.email} (${saved._id})`);

    return res.status(201).json({
      success: true,
      message: "Your message has been received. We'll get back to you within 24 hours.",
      id:      saved._id,
    });

  } catch (err) {
    console.error("❌  Contact save error:", err.message);
    return res.status(500).json({ error: "Failed to submit your message. Please try again." });
  }
}

module.exports = { handleContact };