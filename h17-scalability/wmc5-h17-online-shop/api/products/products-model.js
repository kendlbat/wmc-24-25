import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    min: 0,
    max: 299,
    required: true
  }
});

const Product = mongoose.model('products', productsSchema);

export { Product };

