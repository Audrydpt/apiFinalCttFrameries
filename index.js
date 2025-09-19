const express = require("express");
const jsonServer = require("json-server");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// ===== INIT FIREBASE ADMIN avec variable d'environnement =====
if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error("La variable d'environnement GOOGLE_SERVICE_ACCOUNT est manquante !");
}

let serviceAccount;
try {
    serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

} catch (err) {
    console.error("Erreur lors du parsing de GOOGLE_SERVICE_ACCOUNT:", err);
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// ===== JSON SERVER =====
const router = jsonServer.router(path.join("/data", "db.json"));
const middlewares = jsonServer.defaults();
app.use(middlewares);

// Monte json-server sur /api
app.use("/api", router);

// ===== ROUTE POUR ENVOYER NOTIFICATIONS =====
app.post("/sendNotification", async (req, res) => {
    const { token, title, body } = req.body;

    try {
        const message = { token, notification: { title, body } };
        const response = await admin.messaging().send(message);
        res.json({ success: true, response });
    } catch (err) {
        console.error("❌ Erreur envoi notif", err);
        res.status(500).json({ error: "Impossible d’envoyer la notification" });
    }
});

// ===== START SERVER =====
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Backend is running on port ${port}`);
});
