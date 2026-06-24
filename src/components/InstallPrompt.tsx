'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'drwprime-pwa-install-dismissed';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Sudah terpasang sebagai app → jangan tampilkan
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // Pernah ditutup → jangan ganggu lagi
    if (localStorage.getItem(DISMISS_KEY) === '1') return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, '1');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 z-[70] bottom-[max(6rem,calc(env(safe-area-inset-bottom)+5.5rem))] md:bottom-6 md:left-auto md:right-6 md:inset-x-auto md:max-w-sm">
      <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-[#141414]/95 backdrop-blur-md p-3.5 shadow-2xl shadow-black/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icon-192x192.png"
          alt="DRW Prime"
          className="w-11 h-11 rounded-xl border border-primary/30 flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-semibold leading-tight">Install Aplikasi DRW Prime</p>
          <p className="text-white/50 text-xs mt-0.5">Akses lebih cepat dari layar utama Anda.</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="bg-primary text-dark text-xs font-bold px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Tutup"
            className="text-white/40 hover:text-white p-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
