import { createServer } from "http";
import express from "express";
import { json } from "body-parser";
import { router as apiRouter } from "./routers/api";

const app = express();

app.use((req, _, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});

app.use(json());

// / - public/index.html
// /app.js
// /styles.css
// /listings

app.use("/api", apiRouter);

const server = createServer(app);

server.listen(8090, () => console.log("Server listening on port 8090"));
