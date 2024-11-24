import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import jsonwebtoken from "jsonwebtoken";

import { logger } from "./logging.js";
import { randomUUID } from "crypto";

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
    alice: { password: "always", locked: false, roles: ["student", "tutor"] },
    bob: { password: "hash", locked: true, roles: ["professor"] },
    charlie: { password: "passwords", locked: false, roles: ["student"] },
};

const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization) return res.sendStatus(401);

    const [type, token] = req.headers.authorization.split(" ");

    if (type !== "Bearer") return res.sendStatus(401);

    try {
        const payload = jsonwebtoken.verify(token, JWT_SECRET);
        if (Date.now() >= payload.exp * 1000) throw new Error("token expired");
        req.auth = payload;
        logger.info(`${req.method} ${req.originalUrl} - ${payload.sub}`);
        next();
    } catch (err) {
        logger.warn(`invalid token: ${err.message}`);
        return res.sendStatus(401);
    }
};

const requireRoles = (roles) => (req, res, next) => {
    if (!req.auth.roles.some((r) => roles.includes(r)))
        return res.sendStatus(403);

    next();
};

app.post("/auth/login", (req, res) => {
    // req.body contains { username: '', password: '' }
    const { username, password } = req.body;

    if (!username || !password) return res.sendStatus(400);

    // if user is not locked and password is correct -> status 200

    // otherwise return 401 - Not authorized

    const user = USERS[username];

    if (!user || user.locked || user.password !== password)
        return res.sendStatus(401);

    const jwt = jsonwebtoken.sign(
        {
            roles: user.roles,
        },
        JWT_SECRET,
        {
            jwtid: randomUUID(),
            expiresIn: "3m",
            subject: username,
            issuer: "secure-app",
            algorithm: "HS256",
        }
    );

    res.status(200).send({
        access_token: jwt,
    });
});

app.post("/auth/logout", (req, res) => {
    // TODO: what needs to be done during logout?

    // Either we can implement a blacklist of tokens
    // Or just let the token expire
    // I will just let the token expire
    // KISS

    res.sendStatus(501);
});

// this is the secure data, that is served by the backend
const SECURE_DATA = [
    { text: "This is" },
    { text: "the secured" },
    { text: "data" },
];

app.get(
    "/api/secure-resource",
    authMiddleware,
    requireRoles(["student", "tutor", "professor"]),
    (req, res) => {
        /*
        TODO: 
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
    authMiddleware,
    requireRoles(["tutor", "professor"]),
    (req, res) => {
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

    // TODO: what else needs to be done?

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
