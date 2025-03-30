import "dotenv/config";

import { createServer } from "http";
import path from "path";
import express from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { router as apiRouter } from "./routers/api";
import { Listing } from "./models/listings.model";

const app = express();

app.use((req, _, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});

app.use(json());
app.use(cookieParser(process.env.SESSION_SECRET));

app.all("/login", (req, res, next) => {
    if (req.signedCookies.userId) {
        res.redirect("/");
        return;
    }

    next();
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email !== "omer@int.com" || password !== "Aa123456") {
        res.status(401);
        res.send("Wrong credentials");
        return;
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);

    res.cookie("userId", "f163bb29-6794-4e0d-9619-e2706a128d0b", {
        expires,
        signed: true,
        httpOnly: true,
    });

    res.end();
});

app.use("/api", apiRouter);
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use((_, res) => {
    res.redirect("404.html");
});

const server = createServer(app);

async function init() {
    await mongoose.connect(process.env.CONNECTION_STRING!, {
        dbName: "yad2",
    });

    const res = await Listing.find();
    console.log(res);

    server.listen(8090, () => console.log("Server listening on port 8090"));
}

init();
