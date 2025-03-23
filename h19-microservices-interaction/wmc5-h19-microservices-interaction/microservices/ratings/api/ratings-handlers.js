import { Rating } from "./ratings-model.js";
import { logger } from "../logging.js";
import { getSummaryForProduct } from "./ratings-logic.js";

const getAll = async (req, resp) => {
    try {
        let productId = req.params.productId;
        logger.debug(`Ratings - Fetching ratings for productId`, productId);
        let resultSet = await Rating.find({ productId: productId }).sort({
            timestamp: 1,
        });
        resp.status(200);
        resp.json(resultSet);
    } catch (err) {
        logger.warn(`Ratings - Error getting ratings`, err);
        resp.status(500).send();
    }
};

const getSummary = async (req, resp) => {
    try {
        let productId = req.params.productId;
        logger.debug(
            `Ratings - Fetching summary of ratings for productId`,
            productId
        );
        let summary = await getSummaryForProduct(productId);

        resp.status(200).json(summary);
    } catch (err) {
        logger.warn(`Ratings - Error getting ratings`, err);
        resp.status(500).send();
    }
};

const create = async (req, resp) => {
    try {
        logger.debug(`Ratings - Adding new rating`);
        req.body.productId = req.params.productId;
        let newRating = await Rating.create(req.body);
        resp.status(201);
        resp.location(req.baseUrl + "/" + newRating.id);
        resp.json(newRating);
    } catch (err) {
        logger.warn(`Ratings - Error adding new rating`, err);
        resp.status(500).send();
    }
};

const deleteById = async (req, resp) => {
    let ratingId = req.params.id;
    try {
        logger.debug(`Ratings - Delete rating with id=${ratingId}`);

        let opResult = await Rating.deleteOne({ _id: ratingId });
        if (opResult.deletedCount == 1) {
            resp.status(204).send();
        } else {
            resp.status(404)
                .type("text/plain")
                .send(`Rating with id ${ratingId} not found`);
        }
    } catch (err) {
        logger.warn(`Ratings - Error deleting rating with id=${ratingId}`, err);
        resp.status(500).send();
    }
};

export default {
    create,
    getAll,
    getSummary,
    deleteById,
};
