import { promises as fsp } from "fs";

import mongoose from "mongoose";
import { setupDBConnection } from "./database.js";
import { Product } from "../api/products/products-model.js";
import { Rating } from "../api/ratings/ratings-model.js";

const MONGODB_CONNECTION_STRING =
    process.env.MONGODB_CONNECTION_STRING ||
    "mongodb://127.0.0.1:27017/online-shop";

fillDatabase();

async function fillDatabase() {
    await setupDBConnection(MONGODB_CONNECTION_STRING, true);

    console.log("Starting filling database with demo data...");

    await fillProductsData();
    await fillRatingsData();
    // and so on ...

    console.log("Finished filling database!");
    await mongoose.disconnect();
}

async function fillProductsData() {
    let allProducts = JSON.parse(await fsp.readFile("data/products.json"));

    let successCnt = 0;
    let errorCnt = 0;

    for (let product of allProducts) {
        try {
            await Product.create(product);
            successCnt++;
        } catch (err) {
            errorCnt++;
        }
    }

    console.log(
        `Product data - ${successCnt} products successfully imported, ${errorCnt} products contain errors`
    );
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
