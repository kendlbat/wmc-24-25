import express from "express";

const app = express();
const port = 8080;
let reqId = 1000;
let carId = 4;

// testvalues
const CARS = [
    { id: 1, name: "Nissan Altima" },
    { id: 2, name: "Hyundai Elantra" },
    { id: 3, name: "BMW 3 Series" },
    { id: 4, name: "Mercedes-Benz C-Class" },
    { id: 5, name: "Audi A4" },
    { id: 6, name: "Volkswagen Golf" },
    { id: 7, name: "Subaru Impreza" },
    { id: 8, name: "Mazda 3" },
    { id: 9, name: "Kia Optima" },
    { id: 10, name: "Lexus IS" },
    { id: 11, name: "Tesla Model 3" },
    { id: 12, name: "Jaguar XE" },
    { id: 13, name: "Volvo S60" },
    { id: 14, name: "Infiniti Q50" },
    { id: 15, name: "Acura TLX" },
    { id: 16, name: "Alfa Romeo Giulia" },
    { id: 17, name: "Porsche 911" },
    { id: 18, name: "Ferrari 488" },
    { id: 19, name: "Lamborghini Huracan" },
    { id: 20, name: "McLaren 720S" },
];

// needs to be set in x-api-key header for all non-safe methods, otherwise respond with status code 403
const VALID_API_KEYS = ["4s13a", "aysd3"];

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

// app.set("etag", false);

app.use(express.json());
app.use(requestIdMiddleware);
app.use(logRequestMiddleWare);
app.use(logResponseMiddleWare);

app.get("/cars", (_req, res) => {
    res.status(200).send(CARS);
});

app.get("/cars/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    let c = CARS.find((c) => c.id == id);
    if (!c) return res.status(404).send();
    res.status(200).json(c);
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
            .join(", ")}`,
    );
    next();
}

function logResponseMiddleWare(req, res, next) {
    res.on("finish", () => {
        console.log(
            `${res.locals.id}: ${toTimestamp(new Date())} StatusCode: ${
                res.statusCode
            }\n`,
        );
    });
    next();
}

function requestIdMiddleware(req, res, next) {
    res.locals.id = reqId++;
    next();
}

app.listen(port, () => {
    console.log(`Cars service listening on port ${port}`);
});
