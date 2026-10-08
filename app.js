import e from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { dbConnection } from "./src/database/db.js";
import { errorMiddleware } from "./src/middlewares/error.js";
import morganMiddleware from "./src/middlewares/morganLogger.js";
import userRouter from "./src/routes/userRoutes.js"
import logger from "#utils/logger.js";

const app = e();
// Loads `.env` in the project root when present (no-op on hosts like
// Vercel/Render where env vars come from the dashboard).
config();
const configuredOrigins =
  process.env.FRONTEND_URLS?.trim() || process.env.FRONTEND_URL?.trim() || "";
const allowedOrigins = [...new Set(configuredOrigins
  .split(",")
  .flatMap((value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return [];
    }

    try {
      const url = new URL(trimmedValue);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash ||
        (trimmedValue !== url.origin && trimmedValue !== `${url.origin}/`)
      ) {
        return [];
      }

      return [url.origin];
    } catch {
      return [];
    }
  }))];
const isCorsDebugEnabled =
  process.env.NODE_ENV !== "production" || process.env.CORS_DEBUG === "true";

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = non-browser client (curl, Postman, mobile apps,
      // server-to-server). Browsers are not subject to CORS anyway here.
      const isAllowed = !origin || allowedOrigins.includes(origin);
      if (isCorsDebugEnabled) {
        console.info("[CORS] Origin check", {
          origin: origin ?? null,
          allowedOrigins,
          allowed: isAllowed,
        });
      }

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(cookieParser());
// Middleware
app.use(e.json());
app.use(morganMiddleware); // log HTTP requests
app.use(e.urlencoded({ extended: true }));

app.use("/api/v1", userRouter)

// Health check (Render healthCheckPath, load balancers, uptime monitors)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to MongoDB. Not awaited so the serverless handler (Vercel) can be
// exported immediately; a failed connection fails fast with a clear log.
dbConnection().catch((error) => {
  logger.fatal("💥 Could not connect to MongoDB, exiting.", {
    message: error.message,
  });
  process.exit(1);
});

app.use(errorMiddleware)

export default app;