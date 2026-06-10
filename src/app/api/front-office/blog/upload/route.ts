import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function isAdminUser(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { isAdmin: true }
  });

  return Boolean(user?.isAdmin);
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/-+/g, '-');
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminUser())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File infografis wajib diisi' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WEBP' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 8MB' },
        { status: 400 }
      );
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json(
        { error: 'Upload belum aktif. BLOB_READ_WRITE_TOKEN belum dikonfigurasi di environment server.' },
        { status: 500 }
      );
    }

    const safeName = sanitizeFileName(file.name || 'prime-insight-image');
    const blob = await put(`prime-insight/${Date.now()}-${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token: blobToken
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      message: 'Upload infografis berhasil'
    });
  } catch (error) {
    console.error('[FO BLOG UPLOAD] POST error:', error);

    const rawMessage = error instanceof Error ? error.message : '';
    const isPrivateStoreError = rawMessage.toLowerCase().includes('cannot use public access on a private store');
    const message = isPrivateStoreError
      ? 'Vercel Blob Anda masih private. Ubah akses store menjadi Public di Vercel Storage -> Blob -> Settings -> Access, lalu coba upload lagi.'
      : (rawMessage || 'Gagal upload infografis');

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
