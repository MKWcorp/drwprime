'use client';

import { useEffect, useState } from 'react';

export default function AutoLogin() {
  const [error, setError] = useState('');

  useEffect(() => {
    const login = async () => {
      try {
        const res = await fetch('/cms-api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@drwprime.com',
            password: 'drwprimeadmin2024',
          }),
        });

        if (res.ok) {
          window.location.href = '/cms';
        } else {
          const data = await res.json();
          setError(data?.errors?.[0]?.message || 'Gagal login otomatis. Akun admin belum dibuat.');
        }
      } catch {
        setError('Gagal terhubung ke server.');
      }
    };

    login();
  }, []);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0e16',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        padding: '24px',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '420px',
          textAlign: 'center',
        }}>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: '12px' }}>{error}</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            Jalankan seed admin user terlebih dahulu, atau login manual di{' '}
            <a href="/cms/login" style={{ color: '#d4af37' }}>halaman login</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0e16',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(212,175,55,0.3)',
          borderTopColor: '#d4af37',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
          Masuk otomatis...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
