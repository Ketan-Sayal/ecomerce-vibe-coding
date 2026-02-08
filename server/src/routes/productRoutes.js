import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from "../controllers/productController.js";
import {
  validateProductInput,
  validateObjectId
} from "../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * GET /api/products
 * Get all products with pagination, filtering, and sorting
 * Query params: page, limit, category, sortBy
 */
router.get("/", getAllProducts);

/**
 * GET /api/products/category/:category
 * Get products by category
 */
router.get("/category/:category", getProductsByCategory);

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get("/:id", validateObjectId("id"), getProductById);

/**
 * POST /api/products
 * Create a new product (Admin only)
 */
router.post("/", validateProductInput, createProduct);

/**
 * PUT /api/products/:id
 * Update a product (Admin only)
 */
router.put("/:id", validateObjectId("id"), validateProductInput, updateProduct);

/**
 * DELETE /api/products/:id
 * Delete a product (Admin only)
 */
router.delete("/:id", validateObjectId("id"), deleteProduct);

export default router;
