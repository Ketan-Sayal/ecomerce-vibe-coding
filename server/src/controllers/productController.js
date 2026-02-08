import { Product } from "../models/Product.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

/**
 * Get all products
 * Supports pagination, filtering, and sorting
 */
export const getAllProducts = AsyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, sortBy = "-createdAt" } = req.query;

  const query = {};
  if (category) {
    query.category = category;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(parseInt(limit));

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / parseInt(limit));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalProducts,
            totalPages
          }
        },
        "Products retrieved successfully"
      )
    );
});

/**
 * Get a single product by ID
 */
export const getProductById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product retrieved successfully"));
});

/**
 * Create a new product (Admin only)
 */
export const createProduct = AsyncHandler(async (req, res) => {
  const { name, description, price, image, category, stock, rating, reviews, sku, originalPrice } =
    req.body;

  // Validation is handled by middleware
  const product = new Product({
    name,
    description,
    price,
    originalPrice,
    image,
    category,
    stock,
    rating,
    reviews,
    sku
  });

  await product.save();

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

/**
 * Update a product (Admin only)
 */
export const updateProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Remove fields that shouldn't be updatable
  delete updateData.createdAt;
  delete updateData._id;

  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

/**
 * Delete a product (Admin only)
 */
export const deleteProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

/**
 * Get products by category
 */
export const getProductsByCategory = AsyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.find({ category })
    .skip(skip)
    .limit(parseInt(limit));

  const totalProducts = await Product.countDocuments({ category });
  const totalPages = Math.ceil(totalProducts / parseInt(limit));

  if (products.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, `No products found in category: ${category}`));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalProducts,
            totalPages
          }
        },
        `Products in ${category} retrieved successfully`
      )
    );
});
