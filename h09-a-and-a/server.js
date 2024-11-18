import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import crypto from "crypto";

import { logger } from "./logging.js";

logger.info("Secure Backend - Starting up...");

// Take configuration from environment variables
// or use hardcoded default value
const JWT_SECRET = process.env.JWT_SECRET || "q4ru09aosjdhvvp92";
const PORT = process.env.PORT || 8080;
const HOSTNAME = process.env.BINDADDRESS || "0.0.0.0";

const app = express();

app.use(
    express.json({ type: ["application/json", "application/merge-patch+json"] })
);
app.use(cookieParser());

// for sake of simplicity all users are stored in this object
// normally, passwords need to be stored as hashes including salt and
// NEVER EVER in plain text
const USERS = {
    alice: {
        password:
            "9cdc6c47aa193ae7fdab6c57a88f118e0adbe254c82095d39531f5e5c1314bdd",
        locked: false,
        roles: ["student", "tutor"],
    },
    bob: {
        password:
            "d04b98f48e8f8bcc15c6ae5ac050801cd6dcfd428fb5f9e65c4e16e7807340fa",
        locked: true,
        roles: ["professor"],
    },
    charlie: {
        password:
            "3049a1f8327e0215ea924b9e4e04cd4b0ff1800c74a536d9b81d3d8ced9994d3",
        locked: false,
        roles: ["student"],
    },
};

const hashPassword = (password) => {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
};

// use this object for cookie-based implementation only
// store a mapping between session-id and username
const SESSIONS = {};

app.post("/auth/login", (req, res) => {
    // req.body contains { username: '', password: '' }
    // if user is not locked and password is correct -> status 200
    // otherwise return 401 - Not authorized

    const { username, password } = req.body;

    if (!username || !password) return res.status(400).send();

    if (
        !USERS[username] ||
        USERS[username].password !== hashPassword(password) ||
        USERS[username].locked
    )
        return res.status(401).send();

    const sessionId = crypto.randomBytes(16).toString("hex");
    SESSIONS[sessionId] = username;

    res.cookie("session-id", sessionId, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    });

    res.status(200).send();
});

app.post("/auth/logout", (req, res) => {
    const sessionId = req.cookies["session-id"];
    if (!SESSIONS[sessionId]) return res.status(401).send();

    delete SESSIONS[sessionId];
    res.clearCookie("session-id", { httpOnly: true, sameSite: "strict" });
    res.status(200).send();
});

// this is the secure data, that is served by the backend
const SECURE_DATA = [
    { text: "This is" },
    { text: "the secured" },
    { text: "data" },
];

const authMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.cookies["session-id"]) return res.status(401).send();

        const username = SESSIONS[req.cookies["session-id"]];
        if (!USERS[username]) return res.status(401).send();

        logger.info(`user ${username} accessing secure resource ${req.url}`);

        if (!allowedRoles.some((role) => USERS[username].roles.includes(role)))
            return res.status(403).send();

        next();
    };
};

app.get(
    "/api/secure-resource",
    authMiddleware(["student", "tutor", "professor"]),
    (req, res) => {
        /*
        log user info here and check that user has at
        least one of the roles 'student', 'tutor' or 'professor'

        if not authenticated -> status code 401
        if not authorized (not correct role) -> status code 403
        otherwise send secure data -> status code 200
    */

        res.status(200).json(SECURE_DATA);
    }
);

app.post(
    "/api/secure-resource",
    authMiddleware(["tutor", "professor"]),
    (req, res) => {
        if (!req.cookies["session-id"]) return res.status(401).send();

        const username = SESSIONS[req.cookies["session-id"]];
        if (!USERS[username]) return res.status(401).send();

        logger.info(`user ${username} adding data to secure resource`);

        if (
            !USERS[username].roles.includes("tutor") &&
            !USERS[username].roles.includes("professor")
        )
            return res.status(403).send;

        SECURE_DATA.push(req.body);
        res.status(201).json(SECURE_DATA);
    }
);

/*
    This (unprotected) handler allows to update users and emulate
    a change of the user, like locking the user  
*/
app.patch("/users/:username", (req, res) => {
    let propsToPatch = req.body;

    const username = req.params.username;
    if (!(username in USERS)) {
        logger.warn(`unable to update unknown user ${username}`);
        return res.status(404).type("plain").send(`unknown user ${username}`);
    }

    // simple JSON merge patch here...
    USERS[username] = { ...USERS[username], ...propsToPatch };
    logger.info(`updating user ${username} ${JSON.stringify(propsToPatch)}`);

    if (propsToPatch.locked) {
        Object.keys(SESSIONS).forEach((sessionId) => {
            if (SESSIONS[sessionId] === username) {
                delete SESSIONS[sessionId];
            }
        });

        logger.info(`destroyed all sessions for user ${username}`);
    }

    res.status(200).json(USERS[username]);
});

/*
    This (unprotected) handler allows to delete users from the system
*/
app.delete("/users/:username", (req, res) => {
    const username = req.params.username;
    if (!(username in USERS)) {
        logger.warn(`unable to delete unknown user ${username}`);
        return res.status(404).type("plain").send(`unknown user ${username}`);
    }

    logger.info(`deleting user ${username}`);
    delete USERS[username];

    Object.keys(SESSIONS).forEach((sessionId) => {
        if (SESSIONS[sessionId] === username) {
            delete SESSIONS[sessionId];
        }
    });

    logger.info(`destroyed all sessions for user ${username}`);

    res.status(204).send();
});

app.use(express.static("client"));

// create HTTP server
const httpServer = http.createServer(app);

// start listening to HTTP requests
httpServer.listen(PORT, HOSTNAME, () => {
    logger.info(`Backend - Running on port ${PORT}...`);
});

export default httpServer;
