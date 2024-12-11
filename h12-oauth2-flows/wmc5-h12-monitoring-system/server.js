import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import jsonwebtoken from "jsonwebtoken";
import jwksClient from "jwks-rsa";

import { logger } from "./logging.js";

logger.info("Backend - Starting up...");

// Take configuration from environment variables
// or use hardcoded default value
const HOSTNAME = process.env.BINDADDRESS || "0.0.0.0";
const PORT = process.env.PORT || 8080;
const TENANT_ID = process.env.TENANT_ID || "common";

const app = express();

app.use(
    express.json({ type: ["application/json", "application/merge-patch+json"] })
);
app.use(cors());
app.use(express.static(path.join("client", "dist")));

const jwks = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`,
});

app.post("/api/metrics/", [
    (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            logger.error("No authorization header");
            res.status(401).send();
            return;
        }
        const token = authHeader.split(" ")[1];

        const decoded = jsonwebtoken.decode(token, { complete: true });

        if (!decoded) {
            logger.error("Failed to decode token");
            res.status(401).send();
            return;
        }

        const keyid = decoded.header.kid;

        jwks.getSigningKey(keyid, (err, key) => {
            if (err) {
                logger.error("Failed to get signing key");
                res.status(401).send();
                return;
            }

            jsonwebtoken.verify(token, key.getPublicKey(), (err, decoded) => {
                if (err) {
                    logger.error("Failed to verify token");
                    res.status(401).send();
                    return;
                }

                logger.info("Token verified");
                next();
            });
        });
    },
    (req, res) => {
        logger.info(`data received`);
        let data = req.body;
        logger.info(JSON.stringify(data));
        res.status(201).send();
    },
]);

// create HTTP server
const httpServer = http.createServer(app);

// start listening to HTTP requests
httpServer.listen(PORT, HOSTNAME, () => {
    logger.info(`Backend - Running on port ${PORT}...`);
});

export default httpServer;
