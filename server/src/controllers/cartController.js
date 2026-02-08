import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

/**
 * Get cart by session ID
 */
export const getCart = AsyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const cart = await Cart.findOne({ sessionId }).populate("items.productId");

  if (!cart) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Cart not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

/**
 * Add item to cart
 */
export const addToCart = AsyncHandler(async (req, res) => {
  const { sessionId, productId, quantity = 1 } = req.body;

  // Validate required fields
  if (!sessionId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Session ID is required"));
  }

  if (!productId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Product ID is required"));
  }

  // Validate quantity
  if (quantity < 1 || !Number.isInteger(quantity)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Quantity must be a positive integer"));
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }

  // Check stock
  if (product.stock < quantity) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          `Insufficient stock. Available: ${product.stock}`
        )
      );
  }

  // Find or create cart
  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = new Cart({ sessionId });
  }

  // Check if item already exists in cart
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `Insufficient stock. Available: ${product.stock}`
          )
        );
    }
    existingItem.quantity = newQuantity;
    existingItem.totalPrice = existingItem.price * newQuantity;
  } else {
    // Add new item
    cart.items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      totalPrice: product.price * quantity
    });
  }

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item added to cart successfully"));
});

/**
 * Update item quantity in cart
 */
export const updateCartItem = AsyncHandler(async (req, res) => {
  const { sessionId, productId, quantity } = req.body;

  // Validate required fields
  if (!sessionId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Session ID is required"));
  }

  if (!productId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Product ID is required"));
  }

  if (quantity === undefined || quantity === null) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Quantity is required"));
  }

  // Validate quantity
  if (quantity < 1 || !Number.isInteger(quantity)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Quantity must be a positive integer"));
  }

  // Find cart
  const cart = await Cart.findOne({ sessionId });
  if (!cart) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Cart not found"));
  }

  // Find item in cart
  const item = cart.items.find(
    (item) => item.productId.toString() === productId
  );
  if (!item) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Item not found in cart"));
  }

  // Check stock
  const product = await Product.findById(productId);
  if (product.stock < quantity) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          `Insufficient stock. Available: ${product.stock}`
        )
      );
  }

  // Update quantity and total price
  item.quantity = quantity;
  item.totalPrice = item.price * quantity;

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart item updated successfully"));
});

/**
 * Remove item from cart
 */
export const removeFromCart = AsyncHandler(async (req, res) => {
  const { sessionId, productId } = req.body;

  // Validate required fields
  if (!sessionId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Session ID is required"));
  }

  if (!productId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Product ID is required"));
  }

  // Find cart
  const cart = await Cart.findOne({ sessionId });
  if (!cart) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Cart not found"));
  }

  // Remove item from cart
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});

/**
 * Clear entire cart
 */
export const clearCart = AsyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const cart = await Cart.findOne({ sessionId });
  if (!cart) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Cart not found"));
  }

  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart cleared successfully"));
});
