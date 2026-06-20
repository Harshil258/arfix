import crypto from "crypto";

/**
 * Generates a unique, URL-safe coupon code.
 * Format: XXXX-XXXX-XXXX  (3 groups of 4 uppercase alphanumeric chars)
 * Example: A3FZ-9QKL-BT72
 */
export const generateCouponCode = (): string => {
  const segment = () =>
    crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 4);
  return `${segment()}-${segment()}-${segment()}`;
};

/**
 * Generates N unique coupon codes, guaranteed no duplicates within the batch.
 */
export const generateUniqueCodes = (quantity: number): string[] => {
  const codes = new Set<string>();
  while (codes.size < quantity) {
    codes.add(generateCouponCode());
  }
  return Array.from(codes);
};
