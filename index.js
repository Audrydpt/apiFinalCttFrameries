const express = require('express');
const jsonServer = require('json-server');
const path = require('path');
const soap = require('soap');

const app = express();

// ===== JSON SERVER =====
const router = jsonServer.router(path.join('/data', 'db.json'));
const middlewares = jsonServer.defaults();

app.use(middlewares);

// Monte ton json-server sur /api
app.use('/api', router);

// ===== ROUTES TABT =====

app.get('/tabt/test', async (req, res) => {
    const url = 'https://api-tabt.frenoy.net/TabTAPI/TabTAPI.asmx?wsdl';

    try {
        const client = await soap.createClientAsync(url);

        const args = {
            System: "CTT-Frameries-App", // identifiant libre pour ton app
            Version: "1.0",
            // User: "ton_username",     // optionnel
            // Password: "ton_password"  // optionnel
        };

        const [result] = await client.TestAsync({ Request: args });

        res.json(result.TestResponse); // La doc dit que la réponse est TestResponse
    } catch (err) {
        console.error("Erreur API TABT:", err);
        res.status(500).json({ error: "Impossible de joindre TABT" });
    }
});



// ===== START SERVER =====
const port = process.env.PORT || 10000; // Render définit PORT
app.listen(port, () => {
    console.log(`Backend is running on port ${port}`);
});
