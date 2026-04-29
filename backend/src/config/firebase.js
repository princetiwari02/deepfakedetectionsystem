// src/config/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// Initializes Firebase Admin SDK.
// Used ONLY for verifying Firebase ID tokens sent from the frontend.
//
// SETUP (do this once):
//   1. Go to Firebase Console → your project
//   2. Project Settings → Service Accounts tab
//   3. Click "Generate new private key" → downloads a JSON file
//   4. Rename that file to  serviceAccountKey.json
//   5. Place it in the root of this backend folder (next to package.json)
//   6. Make sure .env has:  FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
//
// ⚠️  NEVER commit serviceAccountKey.json to git — it's in .gitignore
// ─────────────────────────────────────────────────────────────────────────────

const admin = require("firebase-admin");
const path  = require("path");

const keyPath = path.resolve(
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json"
);

try {
  const serviceAccount = require(keyPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅  Firebase Admin SDK initialized");
} catch (err) {
  console.error("❌  Firebase Admin init failed:", err.message);
  console.error("    → Did you place serviceAccountKey.json in the backend root?");
  console.error("    → Expected path:", keyPath);
  process.exit(1); // Can't run safely without auth — stop the server
}

module.exports = admin;