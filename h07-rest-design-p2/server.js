import express from "express";
import data from "./data.js";
import linker from "./linker.js";
import integrity from "./integrity.js";

const app = express();

const api = express.Router();

const getBase = (req) => `${req.protocol}://${req.get("host")}/api/`;

app.use("/api", api);

api.use(express.json());
api.use((req, res, next) => {
    if (req.method === "GET") {
        if (!req.accepts("application/json")) {
            res.status(406).send("Not Acceptable");
            return;
        }
    } else if (req.method === "POST" || req.method === "PUT") {
        if (req.header("content-type") !== "application/json") {
            res.status(415).send("Unsupported Media Type");
            return;
        }
    }
    next();
});

api.get("/authors", (req, res) =>
    res.json(linker.addAuthorsMeta(data.authors.getAll(), getBase(req)))
);

api.get("/authors/:id", (req, res) => {
    const author = data.authors.getById(req.params.id);
    if (!author) return res.status(404).send("Not Found");
    res.json(linker.addAuthorMeta(author, getBase(req)));
});

api.get("/authors/:id/books", (req, res) => {
    const author = data.authors.getById(req.params.id);
    if (!author) return res.status(404).send("Not Found");
    res.json(
        linker.addBooksMeta(data.books.getByAuthor(req.params.id), getBase(req))
    );
});

api.post("/authors", (req, res) => {
    if (!integrity.isProtoAuthor(req.body))
        return res.status(400).send("Bad Request");

    const id = data.authors.create(req.body);
    res.status(201)
        .location(`${getBase(req)}authors/${id}`)
        .end();
});

api.put("/authors/:id", (req, res) => {
    const id = req.params.id;
    if (req.body.id && req.body.id !== id)
        return res.status(400).send("Bad Request");
    delete req.body.id;
    if (!integrity.isProtoAuthor(req.body))
        return res.status(400).send("Bad Request");

    if (!data.authors.updateById(id, req.body))
        return res.status(404).send("Not Found");

    res.status(204).end();
});

api.delete("/authors/:id", (req, res) => {
    if (!data.authors.deleteById(req.params.id))
        return res.status(404).send("Not Found");
    res.status(204).end();
});

api.get("/books", (req, res) =>
    res.json(linker.addBooksMeta(data.books.getAll(), getBase(req)))
);

api.get("/books/:id", (req, res) => {
    const book = data.books.getById(req.params.id);
    if (!book) return res.status(404).send("Not Found");
    res.json(linker.addBookMeta(book, getBase(req)));
});

api.get("/books/:id/bookstores", (req, res) => {
    const book = data.books.getById(req.params.id);
    if (!book) return res.status(404).send("Not Found");
    res.json(
        data.bookstores
            .getByBook(req.params.id)
            .map((bookstore) =>
                linker.addBookstoreMeta(bookstore, getBase(req))
            )
    );
});

api.post("/books", (req, res) => {
    if (!integrity.isProtoBook(req.body))
        return res.status(400).send("Bad Request");

    const id = data.books.create(req.body);
    res.status(201)
        .location(`${getBase(req)}books/${id}`)
        .end();
});

api.put("/books/:id", (req, res) => {
    const id = req.params.id;
    if (req.body.id && req.body.id !== id)
        return res.status(400).send("Bad Request");
    delete req.body.id;
    if (!integrity.isProtoBook(req.body))
        return res.status(400).send("Bad Request");

    if (!data.books.updateById(id, req.body))
        return res.status(404).send("Not Found");

    res.status(204).end();
});

api.delete("/books/:id", (req, res) => {
    if (!data.books.deleteById(req.params.id))
        return res.status(404).send("Not Found");

    res.status(204).end();
});

api.get("/bookstores", (req, res) => {
    res.json(linker.addBookstoresMeta(data.bookstores.getAll(), getBase(req)));
});

api.get("/bookstores/:id", (req, res) => {
    const bookstore = data.bookstores.getById(req.params.id);
    if (!bookstore) return res.status(404).send("Not Found");
    res.json(linker.addBookstoreMeta(bookstore, getBase(req)));
});

api.get("/bookstores/:id/books", (req, res) => {
    const bookstore = data.bookstores.getById(req.params.id);
    if (!bookstore) return res.status(404).send("Not Found");
    res.json(
        data.books
            .getByBookstore(req.params.id)
            .map((book) => linker.addBookMeta(book, getBase(req)))
    );
});

api.post("/bookstores", (req, res) => {
    if (!integrity.isProtoBookstore(req.body))
        return res.status(400).send("Bad Request");

    const id = data.bookstores.create(req.body);
    res.status(201)
        .location(`${getBase(req)}bookstores/${id}`)
        .end();
});

api.put("/bookstores/:id", (req, res) => {
    const id = req.params.id;
    if (req.body.id && req.body.id !== id)
        return res.status(400).send("Bad Request");
    delete req.body.id;
    if (!integrity.isProtoBookstore(req.body))
        return res.status(400).send("Bad Request");

    if (!data.bookstores.updateById(id, req.body))
        return res.status(404).send("Not Found");

    res.status(204).end();
});

api.delete("/bookstores/:id", (req, res) => {
    if (!data.bookstores.deleteById(req.params.id))
        return res.status(404).send("Not Found");

    res.status(204).end();
});

api.post("/bookstores/:bookstore/books/:book", (req, res) => {
    if (data.books.getById(req.params.book) === null)
        return res.status(404).send("Not Found");
    if (data.bookstores.getById(req.params.bookstore) === null)
        return res.status(404).send("Not Found");

    if (data.bookstores.hasBookById(req.params.bookstore, req.params.book))
        return res.status(409).send("Conflict");

    data.bookstores.addBookById(req.params.bookstore, req.params.book);

    res.status(204).end();
});

api.delete("/bookstores/:bookstore/books/:book", (req, res) => {
    if (data.books.getById(req.params.book) === null)
        return res.status(404).send("Not Found");
    if (data.bookstores.getById(req.params.bookstore) === null)
        return res.status(404).send("Not Found");

    data.bookstores.removeBookById(req.params.bookstore, req.params.book);

    res.status(204).end();
});

data.fillDemoData();

app.use((req, res, next) => {
    res.status(404).contentType("text/plain").send("Not found");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
