"use server";
import { EncryptionResult } from "@/types/crypto";
import transformObjectForSerialization from "@/utils/serialization.utils";
import crypto from "crypto";
import logger from "./logger";
const { scryptSync } = await import("node:crypto");

function generateHumanReadableToken(length: number = 8): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const randomBytes = crypto.randomBytes(length);

  const token = Array.from(randomBytes)
    .map((byte) => charset[byte % charset.length])
    .join("");

  return token;
}

function encryptKey(text: string): EncryptionResult {
  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const ivLength = 16;
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
}

function decryptKey(encryptedData: string, iv: string): string {
  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    encryptionKey,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function generateHumanReadableOrderNumber(
  prefix: string = "ORD",
  length: number = 8
): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Array.from({ length }, () =>
    Math.floor(Math.random() * 36)
      .toString(36)
      .toUpperCase()
  ).join("");
  return `${prefix}-${timestamp}-${randomPart}`;
}

function encodeUrlSafeString(input: string): string {
  // Convertimos la cadena a base64 para asegurar compatibilidad con caracteres especiales
  const base64 = Buffer.from(input, "utf8").toString("base64");

  // Reemplazamos caracteres para hacerla más amigable para URLs
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeUrlSafeString(encoded: string): string {
  // Restauramos los caracteres modificados
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

  // Agregamos padding si es necesario
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Encrypt data with a key, return a single string hash
 */
function encryptData<T = unknown>(data: T): string {
  // Create a buffer from the key (must be exactly 32 bytes for aes-256)
  const keyBuffer = scryptSync(process.env.ENCRYPTION_KEY, "salt", 32);

  // Generate a random IV
  const iv = crypto.randomBytes(16);

  // Create cipher
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);

  // Encrypt the data
  let encrypted = cipher.update(
    JSON.stringify(transformObjectForSerialization(data)),
    "utf8",
    "hex"
  );
  encrypted += cipher.final("hex");

  // Prepend the IV to the encrypted data (convert IV to hex)
  return iv.toString("hex") + encrypted;
}

/**
 * Decrypt a single string hash with a key
 */
function decryptData<T = unknown>(data: string): T | null {
  try {
    // Create a buffer from the key (must be exactly 32 bytes for aes-256)
    const keyBuffer = scryptSync(process.env.ENCRYPTION_KEY, "salt", 32);

    // Extract the IV from the encrypted data
    const iv = Buffer.from(data.slice(0, 32), "hex");

    // Extract the encrypted data
    const encrypted = data.slice(32);

    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);

    // Decrypt the data
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  } catch (e) {
    logger.error("[DECRYPT-DATA-ERROR]", e);
    return null;
  }
}

export {
  generateHumanReadableToken,
  generateHumanReadableOrderNumber,
  encryptKey,
  decryptKey,
  encodeUrlSafeString,
  decodeUrlSafeString,
  encryptData,
  decryptData,
};
