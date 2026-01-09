import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./db/connect.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import scanRoutes from "./routes/scan.routes.js";
import logger from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // frontend URL
    credentials: true, // IMPORTANT
  })
);

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes);

// middlewares
app.use(errorHandler);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

(async () => {
  try {
    await connectDB();
    logger.info("✅ Database connected");

    app.listen(PORT, () => {
      logger.info(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (err) {
    logger.error(err, "❌ Unable to connect to the database:");
  }
})();
