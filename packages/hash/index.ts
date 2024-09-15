const pepper = process.env.PEPPER;

import crypto from "crypto";

export function encryptApiKey(apiKey: string): string {
  if (!pepper) {
    throw new Error("PEPPER environment variable is not set");
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(pepper, "hex"),
    iv
  );

  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

export function decryptApiKey(encryptedApiKey: string): string {
  if (!pepper) {
    throw new Error("PEPPER environment variable is not set");
  }

  const [ivHex, encryptedHex] = encryptedApiKey.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(pepper, "hex"),
    iv
  );

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
