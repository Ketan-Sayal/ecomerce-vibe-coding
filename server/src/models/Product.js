import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"]
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be greater than or equal to 0"]
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price must be greater than or equal to 0"]
    },
    image: {
      type: String,
      required: [true, "Product image is required"]
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 10
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"]
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, "Reviews cannot be negative"]
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
