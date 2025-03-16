import { createServer } from "http";

const server = createServer((req, res) => {
    console.log(req.method, req.url);

    res.end();
});

server.listen(8090, () => console.log("Server listening on port 8090"));
