const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");

const ALLOWED_ORIGINS = [
  "https://personaltrainerboard.com",
  "https://www.personaltrainerboard.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function setCors(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");
}

exports.aiCoach = onRequest(
  { secrets: [ANTHROPIC_API_KEY], region: "europe-west1" },
  async (req, res) => {
    setCors(req, res);

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Verifica autenticazione
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const idToken = authHeader.slice(7);

    let uid;
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      uid = decoded.uid;
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Verifica piano pro/admin
    try {
      const userDoc = await admin.firestore().collection("users").doc(uid).get();
      const plan = userDoc.exists ? userDoc.data()?.plan : null;
      if (plan !== "pro" && plan !== "admin") {
        return res.status(403).json({ error: "Pro plan required" });
      }
    } catch {
      return res.status(500).json({ error: "Errore interno" });
    }

    // Valida prompt
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Campo 'prompt' mancante" });
    }

    // Chiama Anthropic
    try {
      const fetch = (await import("node-fetch")).default;
      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY.value(),
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!anthropicRes.ok) {
        console.error("Anthropic error:", anthropicRes.status);
        return res.status(500).json({ error: "Errore nel generare il programma." });
      }

      const data = await anthropicRes.json();
      const text = data.content?.[0]?.text || "Errore nel generare il programma.";
      return res.status(200).json({ text });
    } catch (e) {
      console.error("aiCoach error:", e);
      return res.status(500).json({ error: "Errore interno" });
    }
  }
);
