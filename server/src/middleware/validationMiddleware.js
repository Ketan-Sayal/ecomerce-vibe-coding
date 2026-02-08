import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Validation middleware for products
 */
export const validateProductInput = (req, res, next) => {
  const { name, description, price, image, category, stock } = req.body;

  const errors = [];

  // Validate name
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Product name is required and must be a non-empty string");
  } else if (name.trim().length > 100) {
    errors.push("Product name cannot exceed 100 characters");
  }

  // Validate description
  if (!description || typeof description !== "string" || description.trim().length === 0) {
    errors.push("Product description is required and must be a non-empty string");
  }

  // Validate price
  if (price === undefined || price === null) {
    errors.push("Product price is required");
  } else if (typeof price !== "number" || price < 0) {
    errors.push("Product price must be a non-negative number");
  }

  // Validate image
  if (!image || typeof image !== "string" || image.trim().length === 0) {
    errors.push("Product image URL is required");
  }

  // Validate category
  if (!category || typeof category !== "string" || category.trim().length === 0) {
    errors.push("Product category is required and must be a non-empty string");
  }

  // Validate stock
  if (stock !== undefined && stock !== null) {
    if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
      errors.push("Stock must be a non-negative integer");
    }
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, { errors }, "Validation failed"));
  }

  next();
};

/**
 * Validation middleware for cart operations
 */
export const validateCartInput = (req, res, next) => {
  const { sessionId, productId, quantity } = req.body;

  const errors = [];

  // Validate sessionId
  if (!sessionId || typeof sessionId !== "string" || sessionId.trim().length === 0) {
    errors.push("Session ID is required and must be a non-empty string");
  }

  // Validate productId
  if (!productId || typeof productId !== "string" || productId.trim().length === 0) {
    errors.push("Product ID is required and must be a non-empty string");
  }

  // Validate quantity if provided
  if (quantity !== undefined && quantity !== null) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      errors.push("Quantity must be a positive integer");
    }
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, { errors }, "Validation failed"));
  }

  next();
};

/**
 * Validate MongoDB ObjectId format
 */
export const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // Simple check for 24-character hex string (MongoDB ObjectId format)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, `Invalid ${paramName} format`));
    }
    
    next();
  };
};
