import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";
import { validateCartInput } from "../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * GET /api/cart/:sessionId
 * Get cart for a specific session
 */
router.get("/:sessionId", getCart);

/**
 * POST /api/cart
 * Add item to cart
 * Body: { sessionId, productId, quantity }
 */
router.post("/", validateCartInput, addToCart);

/**
 * PATCH /api/cart
 * Update item quantity in cart
 * Body: { sessionId, productId, quantity }
 */
router.patch("/", validateCartInput, updateCartItem);

/**
 * DELETE /api/cart/item
 * Remove item from cart
 * Body: { sessionId, productId }
 */
router.delete("/item", removeFromCart);

/**
 * DELETE /api/cart/:sessionId
 * Clear entire cart
 */
router.delete("/:sessionId", clearCart);

export default router;
