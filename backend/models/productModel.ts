import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter review name'],
    },
    rating: {
      type: Number,
      required: [true, 'Please enter review rating'],
      default: 0,
    },
    comment: {
      type: String,
      required: [true, 'Please enter review comment'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please enter product user'],
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
      maxLength: [100, 'Product name cannot exceed 100 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Please enter product brand'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      maxLength: [5, 'Product price cannot exceed 5 characters'],
      default: 0.0,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    rating: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Please enter product images'],
      default: '/images/sample.jpg',
    },
    category: {
      type: String,
      required: [true, 'Please enter product category'],
    },
    countInStock: {
      type: Number,
      required: [true, 'Please enter product stock'],
      maxLength: [5, 'Product stock cannot exceed 5 characters'],
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
