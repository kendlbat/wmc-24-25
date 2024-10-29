const integrity = {
    isProtoBook: (book) =>
        typeof book === "object" &&
        !book.hasOwnProperty("id") &&
        typeof book.title === "string" &&
        typeof book.author === "string",
    isProtoAuthor: (author) =>
        typeof author === "object" &&
        !author.hasOwnProperty("id") &&
        typeof author.firstname == "string" &&
        typeof author.lastname == "string",
    isProtoBookstore: (bookstore) =>
        typeof bookstore === "object" &&
        !bookstore.hasOwnProperty("id") &&
        typeof bookstore.name == "string",
};

export default integrity;
