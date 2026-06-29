import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

const ADMIN_EMAIL = 'admin@drwprime.com';
const ADMIN_PASSWORD = 'drwprimeadmin2024';
const COOKIE_NAME = 'payload-token';

async function doLogin() {
  const payload = await getPayload({ config });

  const result = await payload.login({
    collection: 'users',
    data: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
  });

  const res = NextResponse.redirect(new URL('/cms', process.env.NEXT_PUBLIC_SITE_URL || 'https://drwprime.com'));

  res.cookies.set(COOKIE_NAME, result.token ?? '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return res;
}

export async function GET() {
  try {
    return await doLogin();
  } catch {
    // Admin user doesn't exist yet — create then retry
    try {
      const payload = await getPayload({ config });

      await payload.create({
        collection: 'users',
        data: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: 'Admin DRW Prime',
          role: 'admin',
        },
      });

      return await doLogin();
    } catch (err) {
      console.error('[CMS AUTO-LOGIN] Failed:', err);
      return NextResponse.json(
        { error: 'Gagal auto-login CMS. Pastikan database tersedia.' },
        { status: 500 }
      );
    }
  }
}
