import { cookies } from 'next/headers';
import { UserSession } from '@/types';

const COOKIE_NAME = 'ws_session';

export function setSession(session: UserSession): void {
  const value = Buffer.from(JSON.stringify(session)).toString('base64');
  cookies().set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function getSession(): UserSession | null {
  const cookie = cookies().get(COOKIE_NAME);
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

export function clearSession(): void {
  cookies().delete(COOKIE_NAME);
}

export function requireAuth(): UserSession {
  const session = getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
