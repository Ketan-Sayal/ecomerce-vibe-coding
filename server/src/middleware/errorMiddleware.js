import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Global error handling middleware
 * Should be registered as the last middleware in the app
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error("\n❌ Error occurred:");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error();

  // Default error properties
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific error types
  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.keys(err.errors).map(
      (key) => err.errors[key].message
    );
    message = "Validation Error";
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, { errors }, message));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, null, message));
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, null, message));
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  // Default error response
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, null, message));
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  return res
    .status(404)
    .json(
      new ApiResponse(
        404,
        null,
        `Route ${req.method} ${req.originalUrl} not found`
      )
    );
};
