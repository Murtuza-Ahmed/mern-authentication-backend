import e from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { dbConnection } from "./src/database/db.js";
import { errorMiddleware } from "./src/middlewares/error.js";
import morganMiddleware from "./src/middlewares/morganLogger.js";
import userRouter from "./src/routes/userRoutes.js"

export const app = e();
config({ path: "./config.env" });
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookieParser());
// Middleware
app.use(e.json());
app.use(morganMiddleware); // log HTTP requests
app.use(e.urlencoded({ extended: true }));

app.use("/api", userRouter)

dbConnection();

app.use(errorMiddleware)