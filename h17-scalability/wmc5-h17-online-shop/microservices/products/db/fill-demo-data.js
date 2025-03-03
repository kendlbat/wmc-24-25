import { promises as fsp } from "fs";

import mongoose from "mongoose";
import { setupDBConnection } from "./database.js";
import { Product } from "../api/products-model.js";

const MONGODB_CONNECTION_STRING =
    process.env.MONGODB_CONNECTION_STRING ||
    "mongodb://127.0.0.1:5001/online-shop-products";

fillDatabase();

async function fillDatabase() {
    await setupDBConnection(MONGODB_CONNECTION_STRING, true);

    console.log("Starting filling database with demo data...");

    await fillProductsData();

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
