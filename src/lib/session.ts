export type UserRole = 'OWNER' | 'COURIER';

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  exp: number; // Unix timestamp dalam detik
}

export const AUTH_COOKIE_NAME = 'kang_galon_session';
const SECRET_KEY = process.env.SESSION_SECRET || 'kang-galon-super-secret-key-production-32char';

// Base64URL Helpers (Universal: browser, edge, node)
function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecodeToBytes(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signToken(payload: Omit<SessionPayload, 'exp'>): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 hari
  const fullPayload: SessionPayload = { ...payload, exp };

  const enc = new TextEncoder();
  const payloadJson = JSON.stringify(fullPayload);
  const payloadBytes = enc.encode(payloadJson);
  const payloadStr = base64UrlEncode(payloadBytes);

  const key = await getHmacKey();
  const signatureBuffer = await globalThis.crypto.subtle.sign('HMAC', key, enc.encode(payloadStr));
  const signatureStr = base64UrlEncode(signatureBuffer);

  return `${payloadStr}.${signatureStr}`;
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadStr, signatureStr] = parts;
    const enc = new TextEncoder();

    const key = await getHmacKey();
    const sigBytes = base64UrlDecodeToBytes(signatureStr);

    const isValid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(payloadStr)
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlDecodeToBytes(payloadStr);
    const dec = new TextDecoder();
    const payload: SessionPayload = JSON.parse(dec.decode(payloadBytes));

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
