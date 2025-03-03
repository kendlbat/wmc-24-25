import { Rating } from "./ratings-model.js";
import { logger } from "../logging.js";

async function getSummaryForProduct(productId) {
    logger.debug(
        `Ratings - calculate summary of ratings for productId`,
        productId
    );
    let resultSet = await Rating.find({ productId: productId }).sort({
        timestamp: 1,
    });

    let sumOfStars = 0;
    for (let rating of resultSet) {
        sumOfStars += rating.numStars;
    }

    return {
        numRatings: resultSet.length,
        avgStars: resultSet.length
            ? Math.round(sumOfStars / resultSet.length)
            : 0,
    };
}

export { getSummaryForProduct };
