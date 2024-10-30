import { randomUUID } from "node:crypto";
import fs from "node:fs";

/**
 * @type {[id: string]: Author}
 */
const authors = {};

/**
 * @type {[id: string]: Book}
 */
const books = {};

/**
 * @type {[id: string]: Bookstore}
 */
const bookstores = {};

/**
 * @type {{book: string, bookstore: string}[]}
 */
let bookstoresBooks = [];

const data = {
    fillDemoData: () => {
        Object.entries(
            JSON.parse(fs.readFileSync("demodata/authors.json", "utf-8"))
        ).map(([id, author]) => (authors[id] = author));
        Object.entries(
            JSON.parse(fs.readFileSync("demodata/books.json", "utf-8"))
        ).map(([id, book]) => (books[id] = book));
        Object.entries(
            JSON.parse(fs.readFileSync("demodata/bookstores.json", "utf-8"))
        ).map(([id, bookstore]) => (bookstores[id] = bookstore));
        bookstoresBooks = JSON.parse(
            fs.readFileSync("demodata/bookstoresBooks.json", "utf-8")
        );
    },
    books: {
        /**
         * @returns {Book[]}
         */
        getAll: () =>
            Object.entries(books).map(([id, book]) => ({ id, ...book })),

        /**
         * @param {string} id
         * @returns {Book : null}
         */
        getById: (id) => (books[id] ? { id, ...books[id] } : null),

        /**
         * @param {string} id
         * @returns {Book[]}
         */
        getByAuthor: (id) =>
            Object.entries(books)
                .filter(([, book]) => book.author === id)
                .map(([id, book]) => ({ id, ...book })),

        /**
         * @param {string} id
         * @returns {Book[]}
         */
        getByBookstore: (id) =>
            bookstoresBooks
                .filter((entry) => entry.bookstore === id)
                .map((entry) => ({ id: entry.book, ...books[entry.book] })),

        /**
         * @param {ProtoBook} book
         * @returns {string} id
         */
        create: (book) => {
            const id = randomUUID();
            books[id] = book;
            return id;
        },

        /**
         * @param {string} id
         * @param {ProtoBook} book
         * @returns {boolean}
         */
        updateById: (id, book) => {
            if (!books[id]) return false;
            book.id = id;
            books[id] = book;
            return true;
        },

        /**
         * @param {string} id
         * @returns {boolean}
         */
        deleteById: (id) => {
            if (!books[id]) return false;
            delete books[id];
            return true;
        },
    },
    authors: {
        /**
         * @returns {Author[]}
         */
        getAll: () =>
            Object.entries(authors).map(([id, author]) => ({ id, ...author })),
        /**
         * @param {string} id
         * @returns {Author | null}
         */
        getById: (id) => (authors[id] ? { id, ...authors[id] } : null),
        /**
         * @param {string} id
         * @returns {Author[]}
         */
        getByBook: (id) =>
            Object.entries(authors)
                .filter(([, author]) => author.id === id)
                .map(([id, author]) => ({ id, ...author })),
        /**
         * @param {ProtoAuthor} author
         * @returns {string} id
         */
        create: (author) => {
            const id = randomUUID();
            authors[id] = author;
            return id;
        },

        /**
         * @param {string} id
         * @param {ProtoAuthor} author
         * @returns {boolean}
         */
        updateById: (id, author) => {
            if (!authors[id]) return false;
            author.id = id;
            authors[id] = author;
            return true;
        },

        /**
         * @param {string} id
         * @returns {boolean}
         */
        deleteById: (id) => {
            if (!authors[id]) return false;
            delete authors[id];
            return true;
        },
    },
    bookstores: {
        /**
         * @returns {Bookstore[]}
         */
        getAll: () =>
            Object.entries(bookstores).map(([id, bookstore]) => ({
                id,
                ...bookstore,
            })),

        /**
         * @param {string} id
         * @returns {Bookstore | null}
         */
        getById: (id) => (bookstores[id] ? { id, ...bookstores[id] } : null),

        /**
         * @param {string} id
         * @returns {Bookstore[]}
         */
        getByBook: (id) =>
            bookstoresBooks
                .filter((entry) => entry.book === id)
                .map((entry) => ({
                    id: entry.bookstore,
                    ...bookstores[entry.bookstore],
                })),

        /**
         * @param {ProtoBookstore} bookstore
         * @returns {string} id
         */
        create: (bookstore) => {
            const id = randomUUID();
            bookstores[id] = bookstore;
            return id;
        },

        /**
         * @param {string} id
         * @param {ProtoBookstore} bookstore
         * @returns {boolean}
         */
        updateById: (id, bookstore) => {
            if (!bookstores[id]) return false;
            bookstore.id = id;
            bookstores[id] = bookstore;
            return true;
        },

        /**
         * @param {string} id
         * @returns {boolean}
         */
        deleteById: (id) => {
            if (!bookstores[id]) return false;
            delete bookstores[id];
            return true;
        },

        /**
         * @param {string} bookstore
         * @param {string} book
         */
        addBookById: (bookstore, book) => {
            bookstoresBooks.push({ bookstore, book });
        },

        /**
         * @param {string} bookstore
         * @param {string} book
         */
        removeBookById: (bookstore, book) => {
            bookstoresBooks = bookstoresBooks.filter(
                (entry) => entry.bookstore !== bookstore && entry.book !== book
            );
        },

        /**
         * @param {string} bookstore
         * @param {string} book
         * @returns {boolean}
         */
        hasBookById: (bookstore, book) =>
            bookstoresBooks.some(
                (entry) => entry.bookstore === bookstore && entry.book === book
            ),
    },
};

export default data;
