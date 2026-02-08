import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middleware/corsMiddleware.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// ============ Body Parser Middleware ============
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// ============ CORS Middleware ============
app.use(corsMiddleware);

// ============ Health Check Endpoint ============
app.get("/api/health", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    data: null,
    message: "Server is healthy and running",
    success: true
  });
});

// ============ API Routes ============
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);

// ============ 404 Handler (Must be before error handler) ============
app.use(notFoundHandler);

// ============ Global Error Handler (Must be last) ============
app.use(errorHandler);

export { app };