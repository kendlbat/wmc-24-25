import express from "express";

const app = express();
const port = 8080;
let reqId = 1000;
let carId = 4;

// testvalues
const CARS = [
    { id: 1, name: "Toyota Corolla" },
    { id: 2, name: "Honda Civic" },
    { id: 3, name: "Ford Mustang" },
    { id: 4, name: "Chevrolet Camaro" },
];

// needs to be set in x-api-key header for all non-safe methods, otherwise respond with status code 403
const VALID_API_KEYS = ["4s13a", "aysd3"];

/* fullfill lookup table with the correct values */
/**
 * @type {{[method: string]: {safe?: boolean; idempotent?: boolean; cacheable?: boolean;}}}
 */
const METHOD_LOOKUP = {
    GET: {
        safe: true,
        idempotent: true,
        cacheable: true,
    },
    PUT: {
        idempotent: true,
    },
    POST: {},
    DELETE: { idempotent: true },
    PATCH: {},
    HEAD: {
        safe: true,
        idempotent: true,
        cacheable: true,
    },
    OPTIONS: {
        safe: true,
        idempotent: true,
    },
    TRACE: {
        safe: true,
        idempotent: true,
    },
};

app.use(express.json());
app.use(requestIdMiddleware);
app.use(logRequestMiddleWare);
app.use(logResponseMiddleWare);
app.use(apiKeyMiddleware);

app.get("/cars", (_req, res) => {
    res.status(200).send(CARS);
});

app.get("/cars/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    let c = CARS.find((c) => c.id == id);
    if (!c) return res.status(404).send();
    res.status(200).json(c);
});

app.post("/cars", (req, res) => {
    if (Object.keys(req.body || {}).length != 1 || !req.body.name)
        return res.status(400).send("Car can only have name attribute.");
    if (CARS.find((c) => c.name == req.body.name))
        return res.status(400).send("Car name needs to be unique.");
    CARS.push({ id: ++carId, name: req.body.name });
    res.setHeader("location", carId - 1);
    res.status(201).send();
});

app.put("/cars/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Object.keys(req.body || {}).length != 1 || !req.body.name)
        return res.status(400).send("Car can only have name attribute.");
    if (CARS.find((c) => c.name == req.body.name))
        return res.status(400).send("Car name needs to be unique.");

    let ci = CARS.findIndex((c) => c.id == id);

    if (ci == -1) return res.status(404).send("Car not found.");

    CARS[ci] = { ...CARS[ci], ...req.body };
    return res.status(200).json(CARS[ci]);
});

app.delete("/cars/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    let ci = CARS.findIndex((c) => c.id == id);

    if (ci == -1) return res.status(404).send("Car not found.");

    CARS.splice(ci, 1);

    res.status(204).send("Car deleted successfully.");
});

/**
 * But why? ISO8601 would make more sense.
 * @param {Date} date
 * @returns {string}
 */
function toTimestamp(date) {
    return date.toISOString().split("T")[1].slice(0, -1).replace(".", ",");
}

function logRequestMiddleWare(req, _res, next) {
    console.log(
        `${_res.locals.id}: ${toTimestamp(new Date())} ${req.method} ${
            req.url
        } - ${Object.entries(METHOD_LOOKUP[req.method])
            .filter(([k, v]) => v)
            .map(([k, v]) => k)
            .join(", ")}`
    );
    next();
}

function logResponseMiddleWare(req, res, next) {
    res.on("finish", () => {
        console.log(
            `${res.locals.id}: ${toTimestamp(new Date())} StatusCode: ${
                res.statusCode
            }\n`
        );
    });
    next();
}

function apiKeyMiddleware(req, res, next) {
    if (
        !METHOD_LOOKUP[req.method].safe &&
        (!req.headers["x-api-key"] ||
            !VALID_API_KEYS.includes(req.headers["x-api-key"]))
    )
        return res.status(403).send();
    next();
}

function requestIdMiddleware(req, res, next) {
    res.locals.id = reqId++;
    next();
}

app.listen(port, () => {
    console.log(`Cars service listening on port ${port}`);
});
