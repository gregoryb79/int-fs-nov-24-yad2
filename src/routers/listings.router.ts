import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { Listing } from "../models/listings.model";

export const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        const listings = await Listing
            .find(
                {
                    $or: [
                        { title: new RegExp(search?.toString() ?? "", "gi") },
                        { description: new RegExp(search?.toString() ?? "", "gi") }
                    ],
                },
                { _id: true, title: true },
            );

        res.json(listings);
    } catch (error) {
        console.error(error);

        res.status(500);
        res.send("Oops, something went wrong");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            res.status(404);
            res.end();
            return;
        }

        res.json(listing);
    } catch (error) {
        console.error(error);

        res.status(500);
        res.send("Oops, something went wrong");
    }
});

router.put("/:id", authenticate, async (req, res) => {
    try {
        const body = req.body;
        const { id } = req.params;

        await Listing.findOneAndReplace(
            { _id: id },
            body,
            { upsert: true }
        )

        res.status(201);
        res.end();
    } catch (error) {
        console.error(error);

        res.status(500);
        res.send("Oops, something went wrong");
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    try {
        const id = req.params.id;

        await Listing.findOneAndDelete({ _id: id });

        res.status(204);
        res.end();
    } catch (error) {
        console.error(error);

        res.status(500);
        res.send("Oops, something went wrong");
    }
});
