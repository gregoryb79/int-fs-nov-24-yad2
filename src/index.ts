import { randomUUID } from "crypto";
import { createServer } from "http";

// UI - User Interface
// API - Application Programming Interface
// GET /listings?search=&status=&page= - list listings
// GET /listings/:id - get listing details
// PUT /listings/:id - create/update listing
// DELETE /listings/:id - delete listing

type Listing = {
    id: string,
    createdAt: number,
    title: string,
    description?: string,
    price: number,
};

const listings: Listing[] = [];

const server = createServer((req, res) => {
    console.log(req.method, req.url);

    if (req.method === "GET" && req.url === "/listings") {
        res.writeHead(200, {
            "content-type": "application/json"
        });
        res.write(JSON.stringify(listings));
    } else if (req.method === "PUT" && req.url === "/listings") {
        // get body
        listings.push({
            id: randomUUID(),
            createdAt: Date.now(),
            title: "Test listing",
            price: 500,
        });

        res.writeHead(201);
    } else {
        res.writeHead(404);
    }

    res.end();
});

server.listen(8090, () => console.log("Server listening on port 8090"));
