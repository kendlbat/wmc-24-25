import express from "express";
import path from "path";
import expressWsInit from "express-ws";

let nextMsgId = 1;
const MESSAGES = [];

const app = express();
const expressWs = expressWsInit(app);
const port = 8080;

app.set("etag", false);
app.use(express.json());
app.use(express.static(path.join(".", "wwwPublic")));

app.listen(port, () => {
    console.log(`chat-app app listening on port ${port}`);
});

function handleNewMessage(newMsg) {
    const currTimestamp = Math.floor(Date.now() / 1000) * 1000;

    // assign id and timestamp
    newMsg.id = nextMsgId++;
    newMsg.timestamp = currTimestamp;

    MESSAGES.push(newMsg);

    return newMsg;
}

app.ws(
    "/api/messages",
    /**
     * @type {import("express-ws").WebsocketRequestHandler}
     */
    (ws, req, next) => {
        ws.on("message", async (msg) => {
            const newMsg = handleNewMessage(JSON.parse(msg));
            expressWs.getWss().clients.forEach((client) => {
                client.send(JSON.stringify([newMsg]));
            });
        });
        // On connect, send all messages
        ws.send(JSON.stringify(MESSAGES));
    }
);

export default app;
