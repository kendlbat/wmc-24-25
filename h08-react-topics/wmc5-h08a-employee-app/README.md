# Employee App

## Allgemeines

Gegeben ist eine einfache Full-Stack-Applikation basierend auf der bekannten Architektur unter
Verwendung des MERN-Stacks. Die Applikation beinhaltet als Entitäten Standorte (_facilities_) und
Mitarbeiter (_employees_), die in einer 1:n Beziehung stehen. Eine Reihe von Demodaten sind
bereits vorhanden und können wie gewohnt importiert werden.

Machen Sie sich mit der Implementierung vertraut. Die WebApp sollte initial eine Liste von Mitarbeitern
anzeigen.

## How to run

```shell
# start a mongo container in the backend
docker run --name employee-db -d -p 27017:27017 mongo

# install dependencies
npm install

# fill database with demo data
npm run fill-demo-data

# start the backend
npm run dev

# start the frontend in a different terminal
cd client
npm install
npm run dev

# if no longer needed, remove mongo container 
# --> all data is lost
docker rm -f employee-db
```

## How to test

```shell
# start a mongo container in the backend
docker run --name employee-test-db -d -p 50000:27017 mongo

# run tests of the backend
npm install
npm run test

# if no longer needed, remove mongo container 
docker rm -f employee-test-db
```

## Erweiterung Backend

Erweitern Sie das Backend um folgende Funktionalitäten:

* Zur Steigerung der Effizienz sollte es möglich sein, dass bei jedem Employee auch die referenzierte Facility
  eingebettet wird. Dies sollte über den Query-Parameter `embed=(currentFacility)` gesteuert werden können.
  Verwenden Sie dazu die `populate` Methode der Mongoose API.

* Erweitern Sie den Endpunkt `/api/employees` um eine Paging-Funktionalität. Dabei sollte über die Query-Parameter
 `limit` bzw. `offset` gesteuert werden können, wie viele Einträge zurückgeliefert werden bzw. wie viele Einträge
 übersprungen werden müssen. Recherchieren Sie, welche Möglichkeiten die Mongoose API bietet, um die Ergebnismenge
 einer `find` Operation entsprechend einzuschränken.

Es sind eine Reihe von automatisierten Tests vorhanden, die die gewünschte Funktionalität abprüfen. Am Ende der Erweiterung sollten alle Tests erfolgreich ausgeführt werden.
Zusätzlich finden Sie passende HTTP Requests zum Testen der Funktionalität in der Datei `requests/employees.rest`.

## Paging im Frontend

Die aktuelle Implementierung im Frontend stellt alle Employees in einer Liste dar. Verbessern Sie die Implementierung
sodass nur jeweils 15 Employees in der Tabelle angezeigt werden. Die entsprechenden `Pagination` bzw. `Pagination.Item`
Bootstrap Komponenten sind bereits als statische Beispiele eingefügt. Um die Anzahl der Pages bestimmen zu können,
muss natürlich das Backend die Gesamtanzahl zurückliefern, dies ist über den Response-Header `x-total-cnt` realisiert.

## Erweiterung Tabelle

Erweitern Sie die Tabelle um die Spalten _Facility_ bzw. _City_ und stellen Sie dort für die einzelnen Employees
die dazugehörige Facility inkl. der Stadt dar. Verwenden Sie dabei die Möglichkeit, dass diese in die Ergebnismenge
eingebettet wird.
