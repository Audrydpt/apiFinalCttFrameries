const express = require("express");
const jsonServer = require("json-server");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// ===== INIT FIREBASE ADMIN =====
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

// Remplace les \n littéraux par de vrais retours à la ligne
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

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
        const message = {
            token,
            notification: {
                title,
                body,
            },
        };

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
