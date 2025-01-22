import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import { randomUUID } from "crypto";

import { logger } from "./logging.js";

logger.info("Insecure Backend - Starting up...");

const PORT = process.env.PORT || 8080;
const HOSTNAME = process.env.BINDADDRESS || "0.0.0.0";

const app = express();

app.use(
    express.json({ type: ["application/json", "application/merge-patch+json"] })
);
app.use(express.urlencoded({ extended: true })); // support URL encoded bodies as used for /login
app.use(cookieParser());
app.use(express.static("client"));

const USERS = {
    alice: { password: "always", lastname: "Wonderland", roles: ["user"] },
    bob: { password: "hash", lastname: "Baumeister", roles: ["admin"] },
    charlie: { password: "passwords", lastname: "", roles: ["user"] },
};

const POSTS = [
    { id: 1, title: "Admin Post", content: "Only for admins", userId: 1 },
    { id: 2, title: "User1 Post", content: "Only for user1", userId: 2 },
    { id: 3, title: "User2 Post", content: "Only for user2", userId: 3 },
];

const SESSIONS = {};

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const currUser = USERS[username];

    if (currUser && !currUser.locked && password === currUser.password) {
        const sessionId = randomUUID();
        const expires = new Date(Date.now() + 900000);
        SESSIONS[sessionId] = { username, expires };

        logger.info(
            `user ${username} successfully logged in - session-id ${sessionId}`
        );

        res.status(200)
            .cookie("session-id", sessionId, {
                expires,
                httpOnly: true,
            })
            .json({});
    } else {
        logger.warn(`user ${username} failed to log in`);
        res.status(401).send();
    }
});

app.post("/logout", (req, res) => {
    const sessionId = req.cookies["session-id"];

    if (!SESSIONS[sessionId])
        return res.status(401).json({ message: "access denied" });

    SESSIONS[sessionId] = undefined;
    res.status(200).clearCookie("session-id").send();
});

app.use((req, res, next) => {
    const sessionId = req.cookies["session-id"];

    if (!SESSIONS[sessionId])
        return res.status(401).json({ message: "access denied" });

    if (SESSIONS[sessionId].expires < new Date()) {
        SESSIONS[sessionId] = undefined;
        return res.status(401).json({ message: "access denied" });
    }

    req.currentUser = SESSIONS[sessionId].username;

    next();
});

app.get("/posts", (_req, res) => {
    res.json(POSTS);
});

app.put("/posts/:id", (req, res) => {
    const postId = parseInt(req.params.id, 10);
    let post = POSTS.find((p) => p.id === postId);

    if (!post) {
        post = {};
        post.id = req.params.id;
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    POSTS.push(post);
    res.json(post);
});

app.patch("/users/:username", (req, res) => {
    let propsToPatch = req.body;

    const username = req.params.username;

    if (req.currentUser !== username)
        return res.status(401).json({ message: "access denied" });

    if (!(username in USERS)) {
        logger.warn(`unable to update unknown user ${username}`);
        return res.status(404).type("plain").send(`unknown user ${username}`);
    }

    USERS[username] = { ...USERS[username], ...propsToPatch };
    logger.info(`updating user ${username} ${JSON.stringify(propsToPatch)}`);

    const u = { ...USERS[username], password: undefined };

    res.status(200).json(u);
});

const httpServer = http.createServer(app);
httpServer.listen(PORT, HOSTNAME, () => {
    logger.info(`Backend - Running on port ${PORT}...`);
});
