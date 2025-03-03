import { promises as fsp } from "fs";

import mongoose from "mongoose";
import { setupDBConnection } from "./database.js";
import { Rating } from "../api/ratings-model.js";

const MONGODB_CONNECTION_STRING =
    process.env.MONGODB_CONNECTION_STRING ||
    "mongodb://127.0.0.1:6001/online-shop-ratings";

fillDatabase();

async function fillDatabase() {
    await setupDBConnection(MONGODB_CONNECTION_STRING, true);

    console.log("Starting filling database with demo data...");

    await fillRatingsData();

    console.log("Finished filling database!");
    await mongoose.disconnect();
}

async function fillRatingsData() {
    let allRatings = JSON.parse(await fsp.readFile("data/ratings.json"));

    let successCnt = 0;
    let errorCnt = 0;

    for (let rating of allRatings) {
        try {
            await Rating.create(rating);
            successCnt++;
        } catch (err) {
            errorCnt++;
        }
    }

    console.log(
        `Ratings data - ${successCnt} ratings successfully imported, ${errorCnt} ratings contain errors`
    );
}
