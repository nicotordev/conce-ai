
import { EncryptionResult } from '@/types/crypto'
import crypto from 'crypto'

function generateHumanReadableToken(length: number = 8): string {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  const randomBytes = crypto.randomBytes(length)

  const token = Array.from(randomBytes)
    .map((byte) => charset[byte % charset.length])
    .join('')

  return token
}

function encryptKey(text: string): EncryptionResult {
  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
  const ivLength = 16
  const iv = crypto.randomBytes(ivLength)
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
  }
}

function decryptKey(encryptedData: string, iv: string): string {
  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    encryptionKey,
    Buffer.from(iv, 'hex'),
  )
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

function generateHumanReadableOrderNumber(
  prefix: string = 'ORD',
  length: number = 8,
): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomPart = Array.from({ length }, () =>
    Math.floor(Math.random() * 36)
      .toString(36)
      .toUpperCase(),
  ).join('')
  return `${prefix}-${timestamp}-${randomPart}`
}

function encodeUrlSafeString(input: string): string {
  // Convertimos la cadena a base64 para asegurar compatibilidad con caracteres especiales
  const base64 = Buffer.from(input, 'utf8').toString('base64');

  // Reemplazamos caracteres para hacerla más amigable para URLs
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeUrlSafeString(encoded: string): string {
  // Restauramos los caracteres modificados
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

  // Agregamos padding si es necesario
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  return Buffer.from(base64, 'base64').toString('utf8');
}


export {
  generateHumanReadableToken,
  generateHumanReadableOrderNumber,
  encryptKey,
  decryptKey,
  encodeUrlSafeString,
  decodeUrlSafeString,
}
