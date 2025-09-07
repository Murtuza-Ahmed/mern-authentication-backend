import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "MERN_AUTHENTICATION",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("❌ Error while connecting to MongoDB:", error.message);
    process.exit(1);
  }

  // Handle MongoDB connection events
  mongoose.connection.on("connected", () => {
    logger.info("📡 Mongoose connected to DB");
  });

  mongoose.connection.on("error", (err) => {
    logger.error(`⚠️ Mongoose connection error: ${err}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("🔌 Mongoose disconnected from DB");
  });

  // Gracefully close connection on app termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    logger.info("👋 Mongoose connection closed due to app termination (SIGINT)");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await mongoose.connection.close();
    logger.warn("⚠️ Mongoose connection closed due to SIGTERM (server restart/deploy)");
    process.exit(0);
  });

  process.on("uncaughtException", (err) => {
    logger.fatal(`💥 Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
}