import express from "express";
import { requireLogin } from "./auth.mjs";
import jwt from "jsonwebtoken";

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const CSRF_SECRET =
    "iehei6Tai5beequoh0omu5xagiuthae3ohxu4ceude2ozoo3epai7agai4loogohz8heiquipeD";

/**
 * @type {Record<string, { balance: number, transactions: { amount: number; peer: string; }[] }>}
 */
const accounts = JSON.parse(
    fs.readFileSync(
        path.join(import.meta.dirname, "..", "demodata", "broker.json"),
        "utf-8"
    )
);

export const brokerRouter = express.Router();

brokerRouter.get("/csrf", requireLogin, (req, res) => {
    const session = req.user.session;

    res.json({
        csrf: jwt.sign(
            {
                session,
            },
            CSRF_SECRET,
            {
                algorithm: "HS256",
                expiresIn: "1h",
            }
        ),
    });
});

brokerRouter.use(requireLogin);

// Verify csrf token on all post requests
brokerRouter.post("*", (req, res, next) => {
    const { csrf } = req.body;

    try {
        const csrf_token = jwt.verify(csrf, CSRF_SECRET);
        if (req.user.session !== csrf_token.session) {
            throw new Error("Invalid session");
        }
        next();
    } catch (e) {
        console.error(e);
        res.status(403).json({ error: "Invalid CSRF token" });
    }
});

brokerRouter.get("/account", (req, res) => {
    res.json({
        balance: accounts[req.user.sub]?.balance || 0,
        transactions: accounts[req.user.sub]?.transactions || [],
    });
});

brokerRouter.post("/transfer", (req, res) => {
    const { amount, peer, image } = req.body;

    if (!amount || !peer) {
        return res.status(400).json({ error: "Missing amount or peer" });
    }

    if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    if (!accounts[req.user.sub]) {
        accounts[req.user.sub] = { balance: 0, transactions: [] };
    }

    if (accounts[req.user.sub].balance < amount) {
        return res.status(400).json({ error: "Insufficient funds" });
    }

    if (!accounts[peer]) {
        accounts[peer] = { balance: 0, transactions: [] };
    }

    if (image && !image.startsWith("data:image/")) {
        return res.status(400).json({ error: "Invalid image" });
    }

    accounts[req.user.sub].balance -= amount;
    const time = new Date().toISOString();

    const id = randomUUID();
    accounts[req.user.sub].transactions.push({
        amount: -amount,
        peer,
        image,
        id,
        time,
    });
    accounts[peer].balance += amount;
    accounts[peer].transactions.push({
        amount,
        peer: req.user.sub,
        image,
        id,
        time,
    });

    res.sendStatus(200);
});
brokerRouter.post("/deposit", (req, res) => {
    const { amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }

    if (!accounts[req.user.sub]) {
        accounts[req.user.sub] = { balance: 0, transactions: [] };
    }

    const id = randomUUID();
    accounts[req.user.sub].balance += amount;
    accounts[req.user.sub].transactions.push({
        amount,
        peer: req.user.sub,
        id,
        time: new Date().toISOString(),
    });

    res.sendStatus(200);
});
brokerRouter.post("/withdraw", (req, res) => {
    const { amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }

    if (!accounts[req.user.sub]) {
        accounts[req.user.sub] = { balance: 0, transactions: [] };
    }

    if (accounts[req.user.sub] < amount) {
        return res.status(400).json({ error: "Insufficient funds" });
    }

    const id = randomUUID();
    accounts[req.user.sub].balance -= amount;
    accounts[req.user.sub].transactions.push({
        amount: -amount,
        peer: req.user.sub,
        id,
        time: new Date().toISOString(),
    });

    res.sendStatus(200);
});
