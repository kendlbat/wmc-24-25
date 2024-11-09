import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';

import employeesHandlers from './api/employees/employees-handlers.js';
import facilitiesHandlers from './api/facilities/facilities-handlers.js';

import { logger } from './logging.js';
import { setupDBConnection, dropCurrentDatabase } from './db/database.js';

logger.info('Backend - Starting up...');

// Take configuration from environment variables
// or use hardcoded default value
const HOSTNAME = process.env.BINDADDRESS || '0.0.0.0';
const PORT = process.env.PORT || 8080;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1/ex-employee-app';
const MONGODB_RECREATE = process.env.MONGODB_RECREATE === 'true';

const app = express();

app.use(express.json({ type: ['application/json', 'application/merge-patch+json'] }));
app.use(cors());
app.use(express.static(path.join('client', 'dist')));

app.get('/api/employees', employeesHandlers.getAll);
app.get('/api/employees/:id', employeesHandlers.getById);

app.get('/api/facilities', facilitiesHandlers.getAll);
app.get('/api/facilities/:id', facilitiesHandlers.getById);

app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join('client', 'dist', 'index.html'));
});


// create HTTP server
const httpServer = http.createServer(app);

// establish DB connection
setupDBConnection(MONGODB_CONNECTION_STRING, MONGODB_RECREATE);

// add function so that it is accessible by tests
httpServer.dropCurrentDatabase = async () => {
    await dropCurrentDatabase(MONGODB_CONNECTION_STRING);
}

// start listening to HTTP requests
httpServer.listen(PORT, HOSTNAME, () => {
    logger.info(`Backend - Running on port ${PORT}...`);
});

export default httpServer;
