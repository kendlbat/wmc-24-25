import net from "node:net";

const server = net.createServer((socket) => {
    console.log("Client connected");

    socket.on("data", (data) => {
        let incoming = data.toString();
        console.log("Received:\n", incoming);
        let lines = incoming.split("\n");

        let http = {
            method: lines[0].split(" ")[0],
            resource: lines[0].split(" ")[1],
            version: lines[0].split(" ")[2],
            headers: Object.fromEntries(
                incoming
                    .split("\n\n")[0]
                    .split("\n")
                    .slice(1)
                    .map((header) => header.split(": ")),
            ),
            body: incoming.split("\n\n")[1],
        };

        let response = {
            version: "HTTP/1.1",
            status: 404,
            statusText: "Not Found",
            headers: {
                "Content-Type": "text/plain",
                "Content-Length": 9,
            },
            body: "Not Found",
        };

        switch (http.resource) {
            case "/something":
                response.status = 200;
                response.statusText = "OK";
                response.body = "Hello!";
                response.headers["Content-Length"] = response.body.length;
                break;
        }

        let responseString = `${response.version} ${response.status} ${response.statusText}\n`;
        responseString += Object.entries(response.headers)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        responseString += `\n\n${response.body}`;

        console.log("Sent:\n", responseString);
        socket.write(responseString.replace("\n", "\r\n"));
        socket.end();
    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (err) => {
        console.error("Socket error:", err);
    });
});

server.listen(8080, () => {
    console.log("Server listening on port 8080");
});
