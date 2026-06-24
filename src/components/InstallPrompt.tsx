'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type GlobalWithPrompt = {
  __drwInstallPrompt?: BeforeInstallPromptEvent | null;
};

const DISMISS_KEY = 'drwprime-pwa-install-dismissed';

type Mode = 'android' | 'ios' | null;

export default function InstallPrompt() {
  const [mode, setMode] = useState<Mode>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Sudah terpasang sebagai app → jangan tampilkan
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // Pernah ditutup → jangan ganggu lagi
    if (localStorage.getItem(DISMISS_KEY) === '1') return;

    const ua = window.navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua);

    // iOS Safari tidak punya beforeinstallprompt → tampilkan instruksi manual
    if (isIOS) {
      setMode('ios');
      setVisible(true);
      return;
    }

    const w = window as unknown as GlobalWithPrompt;

    const showAndroid = () => {
      if (w.__drwInstallPrompt) {
        setMode('android');
        setVisible(true);
      }
    };

    // Event mungkin sudah tertangkap lebih dulu (global) → langsung tampilkan
    showAndroid();

    const onInstalled = () => {
      setVisible(false);
    };

    window.addEventListener('drw-installable', showAndroid);
    window.addEventListener('drw-installed', onInstalled);

    return () => {
      window.removeEventListener('drw-installable', showAndroid);
      window.removeEventListener('drw-installed', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const w = window as unknown as GlobalWithPrompt;
    const promptEvent = w.__drwInstallPrompt;
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    w.__drwInstallPrompt = null;
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, '1');
  };

  if (!visible) return null;

  return (
    <div className="md:hidden mb-5">
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5 p-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon-192x192.png"
            alt="DRW Prime"
            className="w-11 h-11 rounded-xl border border-primary/30 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-semibold leading-tight">
              Akses Mudah dengan Aplikasi DRW Prime
            </p>
            <p className="text-white/50 text-xs mt-0.5">Pasang di layar utama untuk buka lebih cepat.</p>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Tutup"
            className="text-white/40 hover:text-white p-1 self-start transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {mode === 'android' && (
          <button
            onClick={handleInstall}
            className="mt-3 w-full bg-primary text-dark text-sm font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Install Aplikasi
          </button>
        )}

        {mode === 'ios' && (
          <div className="mt-3 bg-black/30 border border-white/10 rounded-lg p-3">
            <p className="text-white/70 text-xs leading-relaxed">
              Di Safari, ketuk ikon <span className="text-primary font-semibold">Bagikan</span>
              <svg className="inline w-3.5 h-3.5 mx-1 -mt-0.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              lalu pilih <span className="text-primary font-semibold">&ldquo;Tambahkan ke Layar Utama&rdquo;</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
