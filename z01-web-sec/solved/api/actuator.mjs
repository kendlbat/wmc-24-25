import express from "express";
import { writeHeapSnapshot } from "v8";
import { tmpdir } from "os";
import { unlinkSync } from "fs";
import { requireLogin, requireRoles } from "./auth.mjs";

export const actuatorRouter = express.Router();

// A colleague at VW told me that this would be useful for debugging
actuatorRouter.get(
    "/heapdump",
    requireLogin,
    requireRoles(["admin"]),
    (req, res) => {
        const tmp = tmpdir();

        console.log("Creating heapdump");

        const snap = writeHeapSnapshot(`${tmp}/heapdump.heapsnapshot`);

        res.sendFile(snap, () => {
            unlinkSync(snap);
        });
    }
);
