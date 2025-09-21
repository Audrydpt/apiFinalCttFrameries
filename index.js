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


// ===== START SERVER =====
const port = process.env.PORT || 10000; // Render définit PORT
app.listen(port, () => {
    console.log(`Backend is running on port ${port}`);
});
