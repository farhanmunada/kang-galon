'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { loginSchema } from '@/lib/validations';
import { verifyPassword, signToken, AUTH_COOKIE_NAME, getSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  const { email, password } = parsed.data;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase().trim()),
    });

    if (!user) {
      return { success: false, error: 'Email atau kata sandi tidak cocok.' };
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Email atau kata sandi tidak cocok.' };
    }

    const token = await signToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });

    return {
      success: true,
      role: user.role,
      redirectTo: user.role === 'COURIER' ? '/courier' : '/',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Terjadi kesalahan sistem saat login.',
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect('/login');
}

export async function getAuthUser() {
  return await getSession();
}
