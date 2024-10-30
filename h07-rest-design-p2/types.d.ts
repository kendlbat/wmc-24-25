interface ObjectWithId {
    id: string;
}

interface ProtoBook {
    isbn: string;
    title: string;
    author: string;
}

interface Book extends ProtoBook, ObjectWithId {}

interface ProtoAuthor {
    firstname: string;
    lastname: string;
}

interface Author extends ProtoAuthor, ObjectWithId {}

interface ProtoBookstore {
    name: string;
    address: string;
}

interface Bookstore extends ProtoBookstore, ObjectWithId {}

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
