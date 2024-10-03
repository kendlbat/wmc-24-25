import express from "express";
import path from "path";

let nextMsgId = 1;
/**
 * @type {[{ text: string; user: string; id: number; timestamp: number; }]}
 */
const MESSAGES = [];
let longPollers = [];

const app = express();
const port = 8080;

app.set("etag", false);
app.use(express.json());
app.use(express.static(path.join(".", "wwwPublic")));

app.listen(port, () => {
    console.log(`chat-app app listening on port ${port}`);
});

app.get("/api/messages", (req, res) => {
    let longPolling = req.header("x-long-polling") == "true";
    let { idGreaterThan } = req.query;

    if (idGreaterThan && idGreaterThan.match(/^\d+$/)) {
        let idGreaterThan_number = parseInt(idGreaterThan);

        if (longPolling && idGreaterThan_number >= MESSAGES.length)
            return longPollers.push([idGreaterThan_number, res]);

        return res.json(MESSAGES.slice(idGreaterThan_number));
    }

    if (longPolling && MESSAGES.length == 0) return longPollers.push([0, res]);

    res.json(MESSAGES);
});

app.post("/api/messages", (req, res) => {
    const newMsg = { text: req.body.text, user: req.body.user };
    const currTimestamp = Math.floor(Date.now() / 1000) * 1000;

    // assign id and timestamp
    newMsg.id = nextMsgId++;
    newMsg.timestamp = currTimestamp;

    MESSAGES.push(newMsg);

    (async () => {
        // Resolve long pollers asynchronously
        await Promise.allSettled(
            longPollers.map(async ([idGreaterThan_number, lp_res]) => {
                lp_res.json(MESSAGES.slice(idGreaterThan_number));
            })
        );
        longPollers.splice(0);
    })();

    res.location(`/api/messages/${newMsg.id}`);
    res.status(201).json(newMsg);
});

export default app;
