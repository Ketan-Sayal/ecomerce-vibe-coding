import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"]
  },
  name: {
    type: String,
    required: [true, "Product name is required"]
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price must be greater than or equal to 0"]
  },
  image: {
    type: String,
    required: [true, "Product image is required"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
    default: 1
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"]
  }
});

const cartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, "Session ID is required"],
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      index: { expireAfterSeconds: 0 }
    }
  },
  { timestamps: true }
);

// Middleware to calculate total items and price
// Use a synchronous pre-save hook (no `next` callback). Mongoose will
// handle the hook return and promises automatically. Calling `next()`
// can cause issues in some Mongoose versions when the hook is invoked
// by async save operations, so keep this synchronous.
cartSchema.pre("save", function () {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
});

export const Cart = mongoose.model("Cart", cartSchema);
