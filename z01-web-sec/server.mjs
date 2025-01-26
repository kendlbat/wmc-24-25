import express from "express";
import path from "path";

import { authRouter } from "./api/auth.mjs";
import { userRouter } from "./api/user.mjs";
import { actuatorRouter } from "./api/actuator.mjs";
import { brokerRouter } from "./api/broker.mjs";

const app = express();

app.use(
    express.json({
        limit: "10mb",
    })
);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/broker", brokerRouter);
app.use("/actuator", actuatorRouter);

app.get("*", (req, res) => {
    res.sendFile(
        path.join(import.meta.dirname, "client", "dist", "index.html")
    );
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
