// src/config/db.js
// ─────────────────────────────────────────────────────────────────────────────
// Connects to MongoDB Atlas using Mongoose.
//
// SETUP (do this once):
//   1. Go to https://cloud.mongodb.com
//   2. Create a free cluster (M0 Sandbox)
//   3. Database Access → Add Database User (username + password)
//   4. Network Access  → Add IP Address → Allow from Anywhere (0.0.0.0/0)
//   5. Clusters → Connect → Drivers → copy the connection string
//   6. Paste it into .env as MONGODB_URI (replace <password> with your password)
//
// Example URI:
//   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc12.mongodb.net/deepguard?retryWrites=true&w=majority
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌  MONGODB_URI is missing from .env");
    console.error("    → Get it from MongoDB Atlas → Connect → Drivers");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      // These options silence deprecation warnings
      serverSelectionTimeoutMS: 8000, // 8 seconds to find a server
      socketTimeoutMS:          45000,
    });

    const dbName = mongoose.connection.db.databaseName;
    console.log(`✅  MongoDB Atlas connected → database: "${dbName}"`);

  } catch (err) {
    console.error("❌  MongoDB connection failed:", err.message);
    console.error("    Common causes:");
    console.error("    → Wrong password in MONGODB_URI");
    console.error("    → Your IP is not whitelisted in Atlas Network Access");
    console.error("    → Cluster is paused (free tier pauses after inactivity)");
    process.exit(1);
  }

  // Log if connection drops after initial connect
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️   MongoDB disconnected. Reconnecting…");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("✅  MongoDB reconnected.");
  });
}

module.exports = connectDB;