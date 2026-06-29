import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { auth } from '@clerk/nextjs/server';
import { isUserAdmin } from '@/lib/admin';

// Shared Payload service account for the content team. Access to it is gated by
// the Clerk admin check below — it is never exposed through a public login page.
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL || 'admin@drwprime.com';
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD || 'drwprimeadmin2024';
const COOKIE_NAME = 'payload-token';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://drwprime.com';

async function doLogin() {
  const payload = await getPayload({ config });

  const result = await payload.login({
    collection: 'users',
    data: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
  });

  const res = NextResponse.redirect(new URL('/cms', SITE_URL));

  res.cookies.set(COOKIE_NAME, result.token ?? '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return res;
}

export async function GET() {
  // Gate: only a signed-in Clerk admin may obtain a CMS session.
  const { userId } = await auth();
  if (!userId) {
    // Not signed in — send to Clerk sign-in, then back to the CMS.
    return NextResponse.redirect(new URL('/sign-in?redirect_url=/cms', SITE_URL));
  }
  if (!(await isUserAdmin())) {
    // Signed in but not an admin — no CMS access.
    return NextResponse.redirect(new URL('/', SITE_URL));
  }

  try {
    return await doLogin();
  } catch {
    // Service account doesn't exist yet — create it once, then retry.
    try {
      const payload = await getPayload({ config });

      await payload.create({
        collection: 'users',
        data: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: 'Admin DRW Prime',
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
