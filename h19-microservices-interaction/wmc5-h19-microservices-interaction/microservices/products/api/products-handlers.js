import mongoose from "mongoose";
import { Product } from "./products-model.js";
import { logger } from "../logging.js";
import CircuitBreaker from "opossum";

const RATING_SERVICE_URL = process.env.RATING_SERVICE_URL;

const getSummaryForProductREST = async (productId) => {
    if (!RATING_SERVICE_URL) throw new Error("RATING_SERVICE_URL is not set");
    return await fetch(
        RATING_SERVICE_URL + "/api/products/" + productId + "/ratings/summary"
    ).then((res) => {
        console.log(res);
        if (!res.ok) throw new Error();
        return res.json();
    });
};

const options = {
    timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 30000, // After 30 seconds, try again.
};
const breaker = new CircuitBreaker(getSummaryForProductREST, options);

breaker.fallback((productId) => {
    return { rating: undefined, count: undefined };
});

breaker.on("open", () => {
    logger.warn("Rating service circuit breaker opened");
});

breaker.on("fallback", () => {
    logger.warn("Rating service circuit breaker fallback triggered");
});

async function getSummaryForProductRESTCircuitBreaker(productId) {
    return await breaker.fire(productId);
}

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
            try {
                product = {
                    ...product,
                    // ...(await getSummaryForProductREST(productId)),
                    ...(await getSummaryForProductRESTCircuitBreaker(
                        productId
                    )),
                };
            } catch {
                return resp
                    .status(500)
                    .type("text/plain")
                    .send("Upstream service returned an error");
            }
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
