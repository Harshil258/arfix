import createApp from "./app";
import connectDB from "./config/database.config";
import config from "./config/app.config";

const bootstrap = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
    console.log(`📍 Base URL: http://localhost:${config.port}/api/v1`);
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────────────────
  const shutdown = (signal: string) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("✅ HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle unhandled rejections
  process.on("unhandledRejection", (reason: unknown) => {
    console.error("❌ Unhandled Rejection:", reason);
    server.close(() => process.exit(1));
  });
};

bootstrap().catch((err: unknown) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
