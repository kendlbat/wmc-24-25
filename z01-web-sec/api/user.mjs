import express from "express";
import { getUser, requireRoles, requireLogin, users } from "./auth.mjs";

export const userRouter = express.Router();

userRouter.get("/me", requireLogin, (req, res) => {
    res.json(req.user);
});

userRouter.put("/me", requireLogin, (req, res) => {
    const user = req.user.sub;

    users[user] = {
        ...users[user],
        ...req.body,
    };

    res.json({ ...users[user], password: "********" });
});

userRouter.get("/", requireLogin, requireRoles(["admin"]), (req, res) => {
    res.json(
        Object.fromEntries(
            Object.entries(users).map(([username, user]) => [
                username,
                { ...user, password: "********" },
            ])
        )
    );
});

userRouter.get(
    "/:username",
    requireLogin,
    requireRoles(["admin"]),
    (req, res) => {
        const user = getUser(req.params.username);

        if (!user) {
            return res.sendStatus(404);
        }

        res.json({
            ...user,
            password: "********",
        });
    }
);
