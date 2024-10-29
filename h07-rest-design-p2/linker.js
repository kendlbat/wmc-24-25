const linker = {
    /**
     *
     * @param {Book} book
     * @returns {Book & { links: BookLinks }}
     */
    addBookMeta: (book, apiUrl) => ({
        ...book,
        links: {
            self: `${apiUrl}books/${book.id}`,
            author: `${apiUrl}authors/${book.author}`,
            bookstores: `${apiUrl}books/${book.id}/bookstores`,
        },
    }),

    /**
     *
     * @param {Book[]} books
     * @returns {Book[]}
     */
    addBooksMeta: (books, apiUrl) =>
        books.map((book) => linker.addBookMeta(book, apiUrl)),

    /**
     * @param {Bookstore} bookstore
     * @returns {Bookstore & { links: BookstoreLinks }}
     */
    addBookstoreMeta: (bookstore, apiUrl) => ({
        ...bookstore,
        links: {
            self: `${apiUrl}bookstores/${bookstore.id}`,
            books: `${apiUrl}bookstores/${bookstore.id}/books`,
        },
    }),

    /**
     * @param {Bookstore[]} bookstores
     * @returns {Bookstore[]}
     */
    addBookstoresMeta: (bookstores, apiUrl) =>
        bookstores.map((bookstore) =>
            linker.addBookstoreMeta(bookstore, apiUrl)
        ),

    /**
     * @param {Author} author
     * @returns {Author & { links: AuthorLinks }}
     */
    addAuthorMeta: (author, apiUrl) => ({
        ...author,
        links: {
            self: `${apiUrl}authors/${author.id}`,
            books: `${apiUrl}authors/${author.id}/books`,
        },
    }),

    /**
     * @param {Author[]} authors
     * @returns {Author[]}
     */
    addAuthorsMeta: (authors, apiUrl) =>
        authors.map((author) => linker.addAuthorMeta(author, apiUrl)),
};

export default linker;
