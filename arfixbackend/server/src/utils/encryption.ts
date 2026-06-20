import crypto from "crypto";

const ALGORITHM = "aes-256-cbc" as const;
const IV_LENGTH = 16;

const getKey = (): Buffer => {
  const secret = process.env.COUPON_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error(
      "Missing env variable: COUPON_ENCRYPTION_KEY (must be 32 chars)",
    );
  }
  return crypto.createHash("sha256").update(secret).digest();
};

// Returns <iv_hex>:<ciphertext_hex>
export const encrypt = (plainText: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

// Accepts the <iv_hex>:<ciphertext_hex> format produced by encrypt()
export const decrypt = (encryptedText: string): string => {
  const [ivHex, cipherHex] = encryptedText.split(":");
  if (!ivHex || !cipherHex) {
    throw new Error("Invalid encrypted payload format.");
  }
  const iv = Buffer.from(ivHex, "hex");
  const ciphertext = Buffer.from(cipherHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};
