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

/* ===== ROUTES TABT =====

app.get('/tabt/test', async (req, res) => {
    const url = 'https://api.frenoy.net/TabTAPI/TabTAPI.asmx?wsdl';

    try {
        console.log('🔄 Connexion à l\'API TABT...');
        const client = await soap.createClientAsync(url);
        console.log('✅ Client SOAP créé avec succès');

        const args = {
            System: "CTT-Frameries-App",
            Version: "1.0",
        };

        console.log('📤 Envoi de la requête avec les paramètres:', JSON.stringify(args, null, 2));

        const [result] = await client.TestAsync({ Request: args });

        console.log('📥 Réponse brute complète:', JSON.stringify(result, null, 2));
        console.log('📥 Type de la réponse:', typeof result);
        console.log('📥 Clés disponibles dans result:', Object.keys(result));

        if (result.TestResponse) {
            console.log('📥 TestResponse:', JSON.stringify(result.TestResponse, null, 2));
            console.log('📥 Type de TestResponse:', typeof result.TestResponse);
            console.log('📥 Clés dans TestResponse:', Object.keys(result.TestResponse));
        }

        res.json(result.TestResponse);
    } catch (err) {
        console.error("❌ Erreur complète:", err);
        console.error("❌ Message d'erreur:", err.message);
        console.error("❌ Stack trace:", err.stack);
        res.status(500).json({ error: "Impossible de joindre TABT" });
    }
});

*/

// ===== START SERVER =====
const port = process.env.PORT || 10000; // Render définit PORT
app.listen(port, () => {
    console.log(`Backend is running on port ${port}`);
});
