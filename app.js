import e from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { dbConnection } from "./src/database/db.js";

export const app = e();
config({ path: "./config.env" });
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookieParser());
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

dbConnection();