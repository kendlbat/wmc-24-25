# REST Design - Book Store

## Domain Model

```plantuml
class Book {
    isbn: string
    title : string    
}

class Author {
    firstname: string
    lastname: string
}

class Bookstore {    
    name : string
    address: string
}


Author "[1 .. 1]" --> "[0 .. m]" Book : > write(s)

Book "[0 .. n]" - "[0 .. n]" Bookstore : "> x number of books are available in"
```

## Endpunkt Spezifikation

Schreiben Sie die REST-Endpunkte für die _create_, _read_ (_all_ und _single_) und _delete_ Operation für alle Entitäten an.
Überlegen Sie sich dabei auch geeignete Identifier für ihre Entitäten.
Schreiben Sie diese Endpunkte in eine Datei `bookstore.rest`. Geben Sie pro Endpunkt erwartete Response für den _happy flow_ an.

## Exemplarische Umsetzung (freiwillig)

Implementieren Sie mindestens 5 Endpunkte Ihrer Wahl in einer Express-Anwendung. Ein Endpunkt pro Entität muss implementiert werden.
Der Daten der Anwendung können _in memory_ gehalten werden, es ist keine dauerhafte Speicherung erforderlich.
Generieren Sie realistische Testdaten.
