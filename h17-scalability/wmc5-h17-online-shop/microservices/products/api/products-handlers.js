import mongoose from "mongoose";
import { Product } from "./products-model.js";
import { logger } from "../logging.js";

const getAll = async (req, resp) => {
    try {
        logger.debug(`Products - Fetching products with filter`, req.query);
        let resultSet = await Product.find(req.query).sort({ productId: 1 });
        resp.status(200);
        resp.json(resultSet);
    } catch (err) {
        logger.warn(`Products - Error getting products`, err);
        resp.status(500).send();
    }
};

const create = async (req, resp) => {
    try {
        logger.debug(`Products - Adding new product`);

        let newProduct = await Product.create(req.body);
        resp.status(201);
        resp.location("/api/products/" + newProduct.id);
        resp.json(newProduct);
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            resp.status(400).type("text/plain").send("Invalid product object");
        } else if (err.code === 11000) {
            logger.debug(
                "Products - Adding product failed since productId already exists",
                err
            );
            resp.status(400)
                .type("text/plain")
                .send("ProductId already exists");
        } else {
            logger.warn(`Products - Error adding new product`, err);
            resp.status(500).send();
        }
    }
};

const getById = async (req, resp) => {
    let productId = req.params.id;
    try {
        logger.debug(`Products - Fetch product with id=${productId}`);

        let product = await Product.findOne({ productId: productId }).lean();
        if (product) {
            resp.status(200).json(product);
        } else {
            resp.status(404)
                .type("text/plain")
                .send(`Product with id ${req.params.id} not found`);
        }
    } catch (err) {
        logger.warn(
            `Products - Error getting product with id=${productId}`,
            err
        );
        resp.status(500).send();
    }
};

const deleteById = async (req, resp) => {
    let productId = req.params.id;
    try {
        logger.debug(`Products - Delete product with id=${productId}`);

        let opResult = await Product.deleteOne({ productId: productId });
        if (opResult.deletedCount == 1) {
            resp.status(204).send();
        } else {
            resp.status(404)
                .type("text/plain")
                .send(`Product with id ${req.params.id} not found`);
        }
    } catch (err) {
        logger.warn(
            `Products - Error deleting product with id=${productId}`,
            err
        );
        resp.status(500).send();
    }
};

export default {
    create,
    getAll,
    getById,
    deleteById,
};
