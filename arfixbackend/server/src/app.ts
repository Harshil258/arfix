import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import config from "./config/app.config";
import routes from "./routes";
import { globalErrorHandler, notFoundHandler } from "./middleware/error.middleware";

const createApp = (): Application => {
  const app = express();

  // ─── Security & Parsing Middleware ──────────────────────────────────────────
  // app.use(
  //   cors({
  //     origin: config.cors.allowedOrigins,
  //     credentials: true,
  //   })
  // )

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  )
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  app.use(cookieParser());

  // ─── Logging ─────────────────────────────────────────────────────────────────
  if (config.nodeEnv === "development") {
    app.use(morgan("dev"));
  }

  // ─── Static Files ─────────────────────────────────────────────────────────────
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // ─── Health Check ─────────────────────────────────────────────────────────────
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
    });
  });

  // ─── API Routes ───────────────────────────────────────────────────────────────
  app.use("/api/v1", routes);

  // ─── Error Handlers ───────────────────────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};

export default createApp;
