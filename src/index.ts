import { createServer } from "http";
import express from "express";
import { json, urlencoded } from "body-parser";
import { listings, router as listingsRouter } from "./listings.router";
import { router as usersRouter } from "./users.router";
import { randomUUID } from "crypto";

const app = express();

app.use((req, _, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});

app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (_, res) => {
    res.send(
`<html>
        <head>
            <title>Listings</title>
        </head>
        <body>
            <h1>Listings</h1>
            <a href="/create-listing">New listing</a>
            <ul>
                ${listings.map((listing) => `<a href="/listings/${listing.id}"><li>${listing.title}</li></a>`).join("\n")}
            </ul>
        </body>
</html>`);
});

app.get("/create-listing", (req, res) => {
    res.send(
`<html>
        <head>
            <title>Listings</title>
        </head>
        <body>
            <h1>New listing</h1>
            <a href="/">Back</a>
            <form name="listing form" method="post">
                <div>
                    <label for="title">Title</label>
                    <input id="title" name="title" required value="${req.query.title ?? ""}" />
                </div>
                <div>
                    <label for="price">Price</label>
                    <input id="price" name="price" type="number" value="${req.query.price ?? ""}" required />
                </div>
                <div>
                    <label for="description">Description</label>
                    <textarea id="description" name="description">${req.query.description ?? ""}</textarea>
                </div>
                <button>Submit</button>
                ${req.query.error ? `<div>${req.query.error}</div>` : ""}
            </form>
        </body>
</html>`);
});

app.get("/listings/:id", (req,res) => {
    const { id } = req.params;
       
    const listing = listings.find((listing) => listing.id === id);
    
    if (!listing) {
        res.status(404).json({ error: "No such listing" });
        return;
    }
    
    res.send(
        `<head>
            <title>${listing.title}</title>            
        </head>
        <body>
            <h1>${listing.title}</h1>
            <p>Price: ${listing.price}</p>
            ${listing.description ? `<p>${listing.description}</p>` : ""}
            <a href="/">Back</a>
        </body>
        `
    );
});

app.post("/create-listing", (req, res) => {
    const { title, price, description } = req.body;

    if (!title) {
        res.redirect(`/create-listing?price=${price}&title=${title}&description=${description}&error=Title is required`);
        return;
    }

    listings.push({
        id: randomUUID(),
        createdAt: Date.now(),
        title,
        price: Number(price),
        description
    });
    
    res.redirect("/");
});

app.use("/listings", listingsRouter);
app.use("/users", usersRouter);

const server = createServer(app);

server.listen(8090, () => console.log("Server listening on port 8090"));
