import axios from "axios";
import config from "@/config/app.config";

export const razorpayX = axios.create({
  baseURL: "https://api.razorpay.com/v1",
  auth: {
    username: process.env.RAZORPAY_KEY_ID || config.razorpay.keyId,
    password: process.env.RAZORPAY_KEY_SECRET || config.razorpay.keySecret,
  },
  headers: { "Content-Type": "application/json" },
});

export const getRazorpayAccountNumber = (): string | undefined =>
  process.env.RAZORPAY_ACCOUNT_NUMBER?.trim() || undefined;

/** Convert INR rupees to paise for Razorpay APIs */
export const inrToPaise = (amountInr: number): number =>
  Math.round(amountInr * 100);

/** Convert paise to INR */
export const paiseToInr = (paise: number): number => paise / 100;
