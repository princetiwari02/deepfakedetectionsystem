// src/models/Contact.model.js
// ─────────────────────────────────────────────────────────────────────────────
// Stores contact form submissions from the Contact Us page.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:     String,
      required: true,
      trim:     true,
      lowercase: true,
    },
    subject: {
      type:    String,
      default: "General Inquiry",
      trim:    true,
    },
    message: {
      type:     String,
      required: true,
      trim:     true,
    },
    status: {
      type:    String,
      enum:    ["new", "read", "replied"],
      default: "new",
    },
  },
  {
    timestamps: true,
    collection: "contacts",
  }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;