import mongoose from "mongoose";

const ratingsSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    numStars: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    timestamp: {
        type: Date,
        default: Date.now(),
        required: true,
    },
});

// index to speed up lookup for all ratings for the product id
ratingsSchema.index({ productId: 1 }, { unique: false });

// index for returning ratings based on timestamp
ratingsSchema.index({ timestamp: 1 }, { unique: false });

const Rating = mongoose.model("ratings", ratingsSchema);

export { Rating };
