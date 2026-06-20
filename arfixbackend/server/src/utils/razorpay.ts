import Razorpay from "razorpay";
import config from "@/config/app.config";

// ─────────────────────────────────────────────────────────────────────────────
// Razorpay Integration Utility
//
// This module initializes and exports Razorpay instance for payout operations
// Make sure to add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file
// ─────────────────────────────────────────────────────────────────────────────

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || config.razorpay.keyId,
  key_secret: process.env.RAZORPAY_KEY_SECRET || config.razorpay.keySecret,
});

export default razorpayInstance;
