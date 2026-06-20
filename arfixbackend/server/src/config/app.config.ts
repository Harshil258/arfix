import dotenv from "dotenv";
import { AppConfig } from "../types/User";

dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "5000", 10),
  mongoUri: requireEnv("MONGO_URI"),
  jwt: {
    secret: requireEnv("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    cookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN ?? "7", 10),
  },
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000").split(","),
  },
  razorpay: {
    keyId: requireEnv("RAZORPAY_KEY_ID"),
    keySecret: requireEnv("RAZORPAY_KEY_SECRET"),
    accountNumber: process.env.RAZORPAY_ACCOUNT_NUMBER,
  },
};

export default config;
