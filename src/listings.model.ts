import * as path from "path";
import { readFileSync } from "fs";

type Listing = {
    id: string,
    createdAt: number,
    title: string,
    description?: string,
    price: number,
};

let listings: Listing[] = load();

function load() {
    try {
        const raw = readFileSync(path.relative(__filename, path.join(process.cwd(), "data", "listings.json")), "utf8");

        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export function get() {
    return listings.slice();
}

type UpdateListingData = Omit<Listing, "id" | "createdAt">;

export function createOrUpdate(id: string, data: UpdateListingData) {
    const existingListing = listings.find((listing) => listing.id === id);

    if (existingListing) {
        existingListing.title = data.title;
        existingListing.description = data.description;
        existingListing.price = data.price;
    } else {
        listings.push({
            id,
            createdAt: Date.now(),
            ...data
        });
    }
}

export function remove(id: string) {
    if (!listings.some((listing) => listing.id === id)) {
        throw new Error();
    }

    listings = listings.filter((listing) => listing.id !== id);
}
