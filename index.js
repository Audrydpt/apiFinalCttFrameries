const express = require("express");
const jsonServer = require("json-server");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// ===== INIT FIREBASE ADMIN (sans variable d'environnement) =====
const serviceAccount = {
    "type": "service_account",
    "project_id": "ctt-frameries",
    "private_key_id": "c57ba3b66e3099ed0214d4c59e7dbf144bedf16f",
    "private_key": `-----BEGIN PRIVATE KEY-----
MIIEvgIBADAN...
-----END PRIVATE KEY-----`,
    "client_email": "firebase-adminsdk-fbsvc@ctt-frameries.iam.gserviceaccount.com",
    "client_id": "112517379689733232787",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc@ctt-frameries.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

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
