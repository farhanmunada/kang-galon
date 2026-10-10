import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyToken, SessionPayload, UserRole } from './session';

export { AUTH_COOKIE_NAME, type SessionPayload, type UserRole };
export * from './crypto';

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}
