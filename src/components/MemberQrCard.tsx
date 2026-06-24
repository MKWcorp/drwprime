'use client';

import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function MemberQrCard() {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/member-qr');
        if (!res.ok) return;
        const data = await res.json();
        if (active) {
          setToken(data.qrToken);
          setName(data.name);
        }
      } catch {
        // ignore
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading || !token) return null;

  return (
    <div className="mb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full fo-glass-card rounded-xl p-4 border-primary/35 flex items-center justify-between hover:border-primary/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h.01M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">QR Member Saya</p>
            <p className="text-white/50 text-xs">Tunjukkan ke Front Office untuk catat spending</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-primary/60 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-2 fo-glass-card rounded-xl p-5 border-primary/35 text-center">
          <div className="bg-white rounded-xl p-3 w-fit mx-auto">
            <QRCodeCanvas value={token} size={180} level="M" />
          </div>
          <p className="text-white font-semibold text-sm mt-3">{name}</p>
          <p className="text-white/40 text-xs mt-1">Kode unik untuk membership DRW Prime Anda</p>
        </div>
      )}
    </div>
  );
}
