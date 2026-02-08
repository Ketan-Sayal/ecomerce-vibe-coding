/**
 * Seed script to populate initial products in the database
 * Run with: node src/seed.js
 */
import mongoose from "mongoose";
import { config } from "./src/config/index.js";
import { DB_NAME } from "./src/constant.js";
import { Product } from "./src/models/Product.js";
import { sampleProducts } from "./src/data/sampleProducts.js";

const seedDatabase = async () => {
  try {
    await mongoose.connect(`${config.mongodbUri}/${DB_NAME}`);
    console.log("✅ MongoDB connected");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
