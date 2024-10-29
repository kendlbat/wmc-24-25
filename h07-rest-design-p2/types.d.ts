interface ProtoBook {
    isbn: string;
    title: string;
    author: string;
}

interface Book extends ProtoBook {
    id: string;
}

interface ProtoAuthor {
    firstname: string;
    lastname: string;
}

interface Author extends ProtoAuthor {
    id: string;
}

interface ProtoBookstore {
    name: string;
    address: string;
}

interface Bookstore extends ProtoBookstore {
    id: string;
}

interface BookLinks {
    self: string;
    author: string;
    bookstores: string;
}

interface AuthorLinks {
    self: string;
    books: string;
}

interface BookstoreLinks {
    self: string;
    books: string;
}
