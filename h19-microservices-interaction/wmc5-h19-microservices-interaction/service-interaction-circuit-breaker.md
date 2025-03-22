# Circuit Breaker Pattern

Wenden Sie für die Implementierung des `GET /api/products/:id` Endpunkts das _Circuit Breaker Pattern_ an.
Verwenden Sie dafür die Library [opossum](https://github.com/nodeshift/opossum), um den _fetch_ Request
des Product Service an das Rating Service entsprechend zu schützen.

Hinweise:

*   Die Funktion `asyncFunctionThatCouldFail` lt. _Usage_ in der Doku sollte den eigentlichen Request durchführen und die id des Produktes als Parameter entgegennehmen. Der Rückgabewert sollte ein
Promise sein mit dem Ergebnis des HTTP Requests.
*   Statt der Promise Chain im Beispiel der Usage sollte _await_ verwendet werden.
*   Setzen sie eine Fallback-Funktion, die aufgerufen wird, wenn der Circuit Breaker im Zustand _open_ ist. Dies könnte z.B. ein fixes Rating oder das zuletzt bekannte Rating cachen.
*   Kommentieren Sie die Lösung ohne Circuit Breaker in Ihrem Source Code aus, so dass Sie einfach zwischen beiden Varianten wechseln können.
