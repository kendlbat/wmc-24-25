import express from "express";
import http from "http";
import mongoose, { mongo } from "mongoose";
import { createTerminus } from "@godaddy/terminus";

import productsHandlers from "./api/products/products-handlers.js";
import ratingsHandlers from "./api/ratings/ratings-handlers.js";

import { logger } from "./logging.js";
import { setupDBConnection, dropCurrentDatabase } from "./db/database.js";

logger.info("Backend - Starting up...");

// Take configuration from environment variables
// or use hardcoded default value
const HOSTNAME = process.env.BINDADDRESS || "0.0.0.0";
const PORT = process.env.PORT || 8080;
const MONGODB_CONNECTION_STRING =
    process.env.MONGODB_CONNECTION_STRING ||
    "mongodb://127.0.0.1:27017/online-shop";
const MONGODB_RECREATE = process.env.MONGODB_RECREATE === "true";

const app = express();

app.use(express.json());

// simple middleware to add custom header indicating the host name that answered the response
app.use((_req, res, next) => {
    res.setHeader(
        "X-Node-Id",
        process.env.HOSTNAME || process.env.COMPUTERNAME || "n/a"
    );
    next();
});

app.get("/api/products", productsHandlers.getAll);
app.get("/api/products/:id", productsHandlers.getById);
app.post("/api/products", productsHandlers.create);
app.delete("/api/products/:id", productsHandlers.deleteById);

app.get("/api/products/:productId/ratings", ratingsHandlers.getAll);
app.get("/api/products/:productId/ratings/summary", ratingsHandlers.getSummary);
app.post("/api/products/:productId/ratings", ratingsHandlers.create);
app.delete("/api/products/:productId/ratings/:id", ratingsHandlers.deleteById);

// create HTTP server
const httpServer = http.createServer(app);

// establish DB connection
setupDBConnection(MONGODB_CONNECTION_STRING, MONGODB_RECREATE);

// add function so that it is accessible by tests
httpServer.dropCurrentDatabase = async () => {
    await dropCurrentDatabase(MONGODB_CONNECTION_STRING);
};

createTerminus(httpServer, {
    healthChecks: {
        "/health": async function () {
            const errors = [];
            return Promise.all(
                [mongoose.connection.db.admin().ping()].map((p) =>
                    p.catch((error) => {
                        errors.push(error);
                        return undefined;
                    })
                )
            ).then(() => {
                if (errors.length) {
                    throw new HealthCheckError("healthcheck failed", errors);
                }
            });
        },
    },
    statusError: 500,
    onSignal: async () => {
        logger.info("Backend - Server is starting cleanup...");

        await mongoose.connection.close();
    },
    onShutdown: async () => {
        logger.info("Backend - Cleanup finished, server is shutting down...");
    },
    timeout: 5000,
    signals: ["SIGINT", "SIGTERM"],
});

// start listening to HTTP requests
httpServer.listen(PORT, HOSTNAME, () => {
    logger.info(`Backend - Running on port ${PORT}...`);
});

export default httpServer;
