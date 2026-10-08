import mongoose from "mongoose";
import logger from "#utils/logger.js";

// Cache the connection across serverless invocations (Vercel). Without this,
// every cold start / concurrent invocation opens a new MongoDB connection and
// you quickly hit Atlas connection limits.
let cached = globalThis.__mongooseConnection;
if (!cached) {
  cached = globalThis.__mongooseConnection = { conn: null, promise: null };
}

let listenersAttached = false;

const attachListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on("connected", () => {
    logger.info("📡 Mongoose connected to DB");
  });

  mongoose.connection.on("error", (err) => {
    logger.error(`Mongoose connection error: ${err}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("Mongoose disconnected from DB");
  });

  // Gracefully close connection on app termination
  const gracefulShutdown = async (signal) => {
    await mongoose.connection.close();
    logger.info(`Mongoose connection closed (${signal})`);
    process.exit(0);
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("uncaughtException", (err) => {
    logger.fatal(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
};

export const dbConnection = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME || "MERN_AUTHENTICATION",
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Allow retry on next call instead of caching a rejected promise forever
    cached.promise = null;
    logger.error("Error while connecting to MongoDB:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });
    throw error;
  }

  attachListeners();
  logger.info(`MongoDB Connected: ${cached.conn.connection.host}`);
  return cached.conn;
};
