export type BlogStatus = 'draft' | 'published';

export function slugifyTitle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

export function normalizeStatus(value: unknown): BlogStatus {
  return value === 'published' ? 'published' : 'draft';
}

export function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

export function summarizeContent(content: string, length = 170): string {
  const clean = content.replace(/\s+/g, ' ').trim();
  if (clean.length <= length) {
    return clean;
  }

  return `${clean.slice(0, length).trim()}...`;
}
