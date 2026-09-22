import e from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { dbConnection } from "./src/database/db.js";
import { errorMiddleware } from "./src/middlewares/error.js";
import morganMiddleware from "./src/middlewares/morganLogger.js";
import userRouter from "./src/routes/userRoutes.js"

const app = e();
config({ path: "./config.env" });
const allowedOrigins = [process.env.FRONTEND_URL];
app.use(cors({
  // origin: [process.env.FRONTEND_URL],
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));
app.use(cookieParser());
// Middleware
app.use(e.json());
app.use(morganMiddleware); // log HTTP requests
app.use(e.urlencoded({ extended: true }));

app.use("/api/v1", userRouter)

dbConnection();

app.use(errorMiddleware)

export default app;