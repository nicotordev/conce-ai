"use server";

import { decryptData, encryptData } from "@/lib/crypto";

async function encryptDataAction<T = unknown>(data: T): Promise<string> {
  return encryptData(data);
}

async function decryptDataAction<T = unknown>(data: string): Promise<T | null> {
  return decryptData(data);
}

export { encryptDataAction, decryptDataAction };
