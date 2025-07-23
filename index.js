const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join('/data', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const port = process.env.PORT || 10000; // Render définit PORT
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});
