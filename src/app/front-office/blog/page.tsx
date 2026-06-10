'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type BlogStatus = 'draft' | 'published';

type BlogPostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  coverImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags: string[];
  relatedTreatmentSlugs?: string[];
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type EditorState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  tags: string;
  relatedTreatmentSlugs: string;
  status: BlogStatus;
  publishedAt: string;
};

const EMPTY_EDITOR: EditorState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  seoTitle: '',
  seoDescription: '',
  tags: '',
  relatedTreatmentSlugs: '',
  status: 'draft',
  publishedAt: ''
};

function toDateTimeLocal(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isScheduledPost(post: BlogPostItem): boolean {
  if (post.status !== 'published' || !post.publishedAt) {
    return false;
  }

  return new Date(post.publishedAt).getTime() > Date.now();
}

function getDisplayStatus(post: BlogPostItem): 'draft' | 'published' | 'scheduled' {
  if (isScheduledPost(post)) {
    return 'scheduled';
  }

  return post.status;
}

function formatAdminDate(value: string | null | undefined): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function statusChipClass(status: 'draft' | 'published' | 'scheduled'): string {
  if (status === 'scheduled') return 'text-amber-300 border-amber-400/35 bg-amber-500/10';
  if (status === 'published') return 'text-emerald-300 border-emerald-400/35 bg-emerald-500/10';
  return 'text-slate-300 border-slate-400/35 bg-slate-500/10';
}

export default function FrontOfficeBlogPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [schedulingBatch, setSchedulingBatch] = useState(false);
  const [editor, setEditor] = useState<EditorState>(EMPTY_EDITOR);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scheduleStart, setScheduleStart] = useState(() => toDateTimeLocal(new Date().toISOString()));
  const [scheduleIntervalMinutes, setScheduleIntervalMinutes] = useState('120');
  const [scheduleCount, setScheduleCount] = useState('5');
  const [searchQuery, setSearchQuery] = useState('');
  const [listStatusFilter, setListStatusFilter] = useState<'all' | 'draft' | 'published' | 'scheduled'>('all');

  const selectedPost = useMemo(
    () => posts.find((post) => post.slug === selectedSlug) || null,
    [posts, selectedSlug]
  );

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const displayStatus = getDisplayStatus(post);
      const matchStatus = listStatusFilter === 'all' || displayStatus === listStatusFilter;
      const haystack = `${post.title} ${post.slug}`.toLowerCase();
      const matchSearch = !searchQuery.trim() || haystack.includes(searchQuery.trim().toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [posts, listStatusFilter, searchQuery]);

  const checkAdminAccess = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName
        })
      });

      const response = await fetch('/api/user');
      const data = await response.json();

      if (data.user?.isAdmin) {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Error checking admin access:', err);
      router.push('/');
    } finally {
      setCheckingAuth(false);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blog?status=all&limit=100');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengambil data blog');
      }

      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Gagal mengambil data blog');
    } finally {
      setLoading(false);
    }
  };

  const loadPostDetail = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuka artikel');
      }

      const post = data.post as BlogPostItem;
      setSelectedSlug(post.slug);
      setEditor({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        coverImage: post.coverImage || '',
        seoTitle: post.seoTitle || '',
        seoDescription: post.seoDescription || '',
        tags: (post.tags || []).join(', '),
        relatedTreatmentSlugs: (post.relatedTreatmentSlugs || []).join(', '),
        status: post.status || 'draft',
        publishedAt: toDateTimeLocal(post.publishedAt)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuka artikel');
    }
  };

  useEffect(() => {
    if (isLoaded) {
      checkAdminAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (isAdmin) {
      loadPosts();
    }
  }, [isAdmin]);

  const resetEditor = () => {
    setSelectedSlug(null);
    setEditor(EMPTY_EDITOR);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...editor,
        tags: editor.tags,
        relatedTreatmentSlugs: editor.relatedTreatmentSlugs,
        publishedAt: editor.publishedAt || null
      };

      const isEdit = Boolean(selectedSlug);
      const response = await fetch(isEdit ? `/api/blog/${selectedSlug}` : '/api/blog', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan artikel');
      }

      setSuccess(isEdit ? 'Artikel berhasil diperbarui' : 'Artikel berhasil dibuat');
      await loadPosts();

      if (data.post?.slug) {
        await loadPostDetail(data.post.slug);
      } else if (!isEdit) {
        resetEditor();
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Gagal menyimpan artikel');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSlug) {
      return;
    }

    const confirmed = window.confirm('Hapus artikel ini?');
    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/blog/${selectedSlug}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus artikel');
      }

      setSuccess('Artikel berhasil dihapus');
      resetEditor();
      await loadPosts();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Gagal menghapus artikel');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadInfographic = async (file: File) => {
    setUploadingImage(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('file', file);

      const response = await fetch('/api/front-office/blog/upload', {
        method: 'POST',
        body: payload
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal upload infografis');
      }

      setEditor((prev) => ({ ...prev, coverImage: data.url || '' }));
      setSuccess('Infografis berhasil diupload');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Gagal upload infografis');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleScheduleBatch = async () => {
    setError('');
    setSuccess('');

    const interval = Number(scheduleIntervalMinutes);
    const count = Number(scheduleCount);
    const startDate = new Date(scheduleStart);

    if (!scheduleStart || Number.isNaN(startDate.getTime())) {
      setError('Waktu mulai jadwal belum valid');
      return;
    }

    if (!Number.isFinite(interval) || interval < 1) {
      setError('Interval menit minimal 1');
      return;
    }

    if (!Number.isFinite(count) || count < 1) {
      setError('Jumlah artikel minimal 1');
      return;
    }

    const draftPosts = posts
      .filter((post) => post.status === 'draft')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, count);

    if (draftPosts.length === 0) {
      setError('Tidak ada draft yang bisa dijadwalkan');
      return;
    }

    setSchedulingBatch(true);

    try {
      for (let index = 0; index < draftPosts.length; index += 1) {
        const post = draftPosts[index];
        const publishTime = new Date(startDate.getTime() + index * interval * 60 * 1000);

        const response = await fetch(`/api/blog/${post.slug}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'published',
            publishedAt: publishTime.toISOString()
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || `Gagal menjadwalkan artikel: ${post.title}`);
        }
      }

      await loadPosts();
      setSuccess(`Berhasil menjadwalkan ${draftPosts.length} artikel secara berkala`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Gagal menjalankan penjadwalan berkala');
    } finally {
      setSchedulingBatch(false);
    }
  };

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <p>Loading blog manager...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-dark px-5 py-28 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 border border-white/10 rounded-xl bg-black/30 p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Blog</h1>
            <button
              type="button"
              onClick={resetEditor}
              className="text-xs px-3 py-1 rounded-md border border-primary/40 text-primary hover:bg-primary/10"
            >
              Artikel Baru
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 mb-4">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau slug"
              className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-sm"
            />
            <select
              value={listStatusFilter}
              onChange={(e) => setListStatusFilter(e.target.value as 'all' | 'draft' | 'published' | 'scheduled')}
              className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`w-full text-left border rounded-lg p-3 transition-colors ${selectedSlug === post.slug ? 'border-primary/60 bg-primary/10' : 'border-white/10 hover:border-white/30'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className={`text-[11px] px-2 py-1 rounded border font-medium ${statusChipClass(getDisplayStatus(post))}`}>
                    {getDisplayStatus(post).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/prime-insight/${post.slug}`}
                      target="_blank"
                      className="text-[11px] px-2 py-1 rounded border border-white/20 text-white/80 hover:text-white hover:border-white/40"
                    >
                      Lihat
                    </Link>
                    <button
                      type="button"
                      onClick={() => loadPostDetail(post.slug)}
                      className="text-[11px] px-2 py-1 rounded border border-primary/40 text-primary hover:bg-primary/10"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <p className="font-semibold leading-5">{post.title}</p>
                <p className="text-xs text-white/50 mt-2">/{post.slug}</p>
                <p className="text-[11px] text-white/45 mt-2">
                  {getDisplayStatus(post) === 'scheduled' ? 'Jadwal tayang' : 'Publish'}: {formatAdminDate(post.publishedAt)}
                </p>
              </article>
            ))}

            {filteredPosts.length === 0 && (
              <p className="text-sm text-white/50 py-2">Postingan tidak ditemukan.</p>
            )}
          </div>
        </section>

        <section className="lg:col-span-2 border border-white/10 rounded-xl bg-black/30 p-5">
          <div className="flex flex-wrap items-center gap-3 justify-between mb-5">
            <h2 className="text-xl font-bold">{selectedPost ? 'Edit' : 'Buat'}</h2>
            <div className="flex items-center gap-3">
              <Link
                href="/prime-insight"
                target="_blank"
                className="text-sm text-primary hover:text-primary-light"
              >
                Lihat Blog Publik
              </Link>
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
          {success && <p className="mb-4 text-sm text-green-400">{success}</p>}

          {!selectedSlug && (
            <div className="mb-5 rounded-lg border border-primary/30 bg-primary/8 p-4">
              <h3 className="text-sm font-semibold text-primary mb-3">Jadwal Berkala (Banyak Artikel)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-xs text-white/70">Mulai Publish</span>
                  <input
                    type="datetime-local"
                    value={scheduleStart}
                    onChange={(e) => setScheduleStart(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 [color-scheme:dark]"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-white/70">Interval (menit)</span>
                  <input
                    type="number"
                    min={1}
                    value={scheduleIntervalMinutes}
                    onChange={(e) => setScheduleIntervalMinutes(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-white/70">Jumlah Draft</span>
                  <input
                    type="number"
                    min={1}
                    value={scheduleCount}
                    onChange={(e) => setScheduleCount(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                  />
                </label>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleScheduleBatch}
                  disabled={schedulingBatch}
                  className="px-4 py-2 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 disabled:opacity-60"
                >
                  {schedulingBatch ? 'Menjadwalkan...' : 'Jadwalkan Draft Bertahap'}
                </button>
                <p className="text-xs text-white/60">Dipakai untuk menjadwalkan banyak draft sekaligus. Saat edit artikel, gunakan jadwal di bawah.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-white/80">Judul</span>
                <input
                  value={editor.title}
                  onChange={(e) => setEditor((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-white/80">Slug (opsional)</span>
                <input
                  value={editor.slug}
                  onChange={(e) => setEditor((prev) => ({ ...prev, slug: e.target.value }))}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                  placeholder="otomatis dari judul"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-white/80">Excerpt</span>
              <textarea
                value={editor.excerpt}
                onChange={(e) => setEditor((prev) => ({ ...prev, excerpt: e.target.value }))}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                rows={3}
              />
            </label>

            <label className="block">
              <span className="text-sm text-white/80">Konten Artikel</span>
              <textarea
                value={editor.content}
                onChange={(e) => setEditor((prev) => ({ ...prev, content: e.target.value }))}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                rows={14}
                required
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-white/80">URL Infografis/Cover</span>
                <input
                  value={editor.coverImage}
                  onChange={(e) => setEditor((prev) => ({ ...prev, coverImage: e.target.value }))}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm text-white/80">Status</span>
                <select
                  value={editor.status}
                  onChange={(e) => setEditor((prev) => ({ ...prev, status: e.target.value as BlogStatus }))}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>

            {editor.status === 'published' && (
              <label className="block">
                <span className="text-sm text-white/80">Jadwal Publish Artikel Ini</span>
                <input
                  type="datetime-local"
                  value={editor.publishedAt}
                  onChange={(e) => setEditor((prev) => ({ ...prev, publishedAt: e.target.value }))}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 [color-scheme:dark]"
                />
                <p className="text-xs text-white/50 mt-1">Dipakai untuk satu artikel ini. Kosongkan untuk publish sekarang.</p>
              </label>
            )}

            <div className="rounded-lg bg-black/25 border border-white/15 px-4 py-3">
              <p className="text-sm text-white/80 mb-2">Upload Infografis</p>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleUploadInfographic(file);
                  }
                }}
                className="block w-full text-sm text-white/75 file:mr-4 file:rounded-md file:border-0 file:bg-primary/20 file:px-3 file:py-2 file:text-primary"
              />
              <p className="text-xs text-white/50 mt-2">Format: JPG, PNG, WEBP. Maksimal 8MB. Rekomendasi rasio 4:5 (portrait).</p>
              {uploadingImage && <p className="text-xs text-primary mt-2">Uploading infografis...</p>}
              {editor.coverImage && (
                <div className="mt-3 w-44 aspect-[4/5] rounded-lg border border-white/15 overflow-hidden">
                  <img
                    src={editor.coverImage}
                    alt="Preview infografis"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-white/80">SEO Title</span>
                <input
                  value={editor.seoTitle}
                  onChange={(e) => setEditor((prev) => ({ ...prev, seoTitle: e.target.value }))}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm text-white/80">SEO Description</span>
                <input
                  value={editor.seoDescription}
                  onChange={(e) => setEditor((prev) => ({ ...prev, seoDescription: e.target.value }))}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-white/80">Tags (pisahkan koma)</span>
                <input
                  value={editor.tags}
                  onChange={(e) => setEditor((prev) => ({ ...prev, tags: e.target.value }))}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm text-white/80">Related Treatment Slugs</span>
                <input
                  value={editor.relatedTreatmentSlugs}
                  onChange={(e) => setEditor((prev) => ({ ...prev, relatedTreatmentSlugs: e.target.value }))}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2"
                  placeholder="facial-prime, pico-laser"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 disabled:opacity-60"
              >
                {submitting ? 'Menyimpan...' : selectedSlug ? 'Update Artikel' : 'Buat Artikel'}
              </button>

              {selectedSlug && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleDelete}
                  className="px-5 py-2 rounded-lg border border-red-500/50 text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                >
                  Hapus Artikel
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
