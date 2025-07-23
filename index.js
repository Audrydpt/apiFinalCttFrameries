const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("/data/db.json"); // <-- modifié ici
const middlewares = jsonServer.defaults();
const cors = require("cors");
const port = process.env.PORT || 10000; // Utilisation du port 10000 pour Render

// Configuration CORS avancée
server.use(cors({
    origin: '*', // Autorise toutes les origines
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour déboguer les requêtes
server.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

server.use(middlewares);
server.use(router);

server.listen(port, () => {
    console.log(`JSON Server est démarré sur le port ${port}`);
});