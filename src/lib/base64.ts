// Robust Base64 encode/decode utilities with Unicode and URL-safe support
// No use of deprecated escape/unescape. Works fully in the browser.

// Normalize a base64 string: trim, remove whitespace, convert URL-safe to standard, and add padding
function normalizeBase64(input: string): string {
  let s = input.trim().replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/")
  // Validate allowed characters (before padding)
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s.replace(/=+$/, ""))) {
    // Allow missing padding during validation by temporarily ignoring trailing '='
    throw new Error("Invalid Base64 characters detected")
  }
  const pad = s.length % 4
  if (pad) s += "=".repeat(4 - pad)
  return s
}

// Bytes -> Base64
function bytesToBase64(bytes: Uint8Array): string {
  // Chunked conversion to avoid call stack/argument limits
  const chunkSize = 0x8000 // 32KB per chunk
  let binary = ""
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }
  return btoa(binary)
}

// Base64 -> Bytes
function base64ToBytes(b64: string): Uint8Array {
  const normalized = normalizeBase64(b64)
  const binary = atob(normalized)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function encodeTextToBase64(text: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(text)
  return bytesToBase64(bytes)
}

export function decodeBase64ToText(b64: string): string {
  const bytes = base64ToBytes(b64)
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

export const base64Utils = {
  encodeTextToBase64,
  decodeBase64ToText,
}
