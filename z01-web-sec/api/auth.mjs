import express from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

export const authRouter = express.Router();

const SECRET =
    "PhaiChiemoh3eichahShiDai9Ie8he8loj5ooreeR6Ai7shu7Peixa1loeKeifaeg7ohKi6Voo2";
const ALGORITHM = "HS256";
const ACCESS_TOKEN_TTL = 60 * 60; // 60 minutes
const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60; // 30 days

/**
 * Passwords being in plaintext here should not be counted as a vulnerability.
 * Normally, hash these passwords and store the hashes in a database.
 *
 * @type {{[username: string]: {password: string; roles: string[]}}}
 */
export const users = {
    admin: {
        password: "admin",
        roles: ["admin"],
    },
    user: {
        password: "password",
        roles: ["user"],
    },
    john: {
        password: "betonmischer",
        roles: ["admin"],
    },
};

export const getUser = (username) => users[username];

authRouter.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.sendStatus(400);
    }

    if (!users[username] || users[username].password !== password) {
        return res.sendStatus(401);
    }

    const session = randomUUID();

    const access_token = jwt.sign(
        {
            roles: users[username].roles,
            session,
        },
        SECRET,
        {
            algorithm: ALGORITHM,
            expiresIn: ACCESS_TOKEN_TTL,
            audience: "bergbroker-client",
            issuer: "bergbroker",
            subject: username,
            jwtid: randomUUID(),
        }
    );

    const refresh_token = jwt.sign(
        {
            roles: users[username].roles,
            session,
        },
        SECRET,
        {
            algorithm: ALGORITHM,
            expiresIn: REFRESH_TOKEN_TTL,
            audience: "bergbroker-client",
            issuer: "bergbroker",
            subject: username,
            jwtid: randomUUID(),
        }
    );

    res.status(200).json({
        access_token,
        refresh_token,
        access_token_expires: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL,
        refresh_token_expires:
            Math.floor(Date.now() / 1000) + REFRESH_TOKEN_TTL,
        user: {
            username,
            roles: users[username].roles,
        },
    });
});

authRouter.post("/refresh", (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.sendStatus(400);
    }

    let valid;
    try {
        valid = jwt.verify(refresh_token, SECRET, {
            algorithms: [ALGORITHM],
            audience: "bergbroker-client",
            issuer: "bergbroker",
        });
        if (!valid?.session) {
            throw new Error("Invalid token");
        }
    } catch (e) {
        return res.sendStatus(401);
    }

    const access_token = jwt.sign(
        {
            roles: valid.roles,
            session: valid.session,
        },
        SECRET,
        {
            algorithm: ALGORITHM,
            expiresIn: ACCESS_TOKEN_TTL,
            audience: "bergbroker-client",
            issuer: "bergbroker",
            subject: valid.sub,
            jwtid: randomUUID(),
        }
    );

    res.status(200).json({
        access_token,
        access_token_expires: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL,
        user: {
            username: valid.sub,
            roles: valid.roles,
        },
    });
});

export const requireLogin = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.sendStatus(401);
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer") {
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            console.warn(err.message);
            return res.sendStatus(401);
        }

        req.user = decoded;
        next();
    });
};

// roles = ["admin"]
// user needs to have at least one of the roles in the array
export const requireRoles = (roles) => (req, res, next) => {
    if (!req.user.roles.find((role) => roles.includes(role)))
        return res.sendStatus(403);

    next();
};
