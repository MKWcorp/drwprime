import React from 'react';

type HourglassProps = {
  size?: number;
  className?: string;
};

export function Hourglass({ size = 96, className = '' }: HourglassProps) {
  return (
    <svg
      width={size}
      height={(size * 140) / 100}
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`hg-rotate ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hgSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4d03f" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
        <linearGradient id="hgFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4d03f" />
          <stop offset="55%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#a9842a" />
        </linearGradient>
      </defs>

      {/* Caps */}
      <rect x="16" y="9" width="68" height="7" rx="3.5" fill="url(#hgFrame)" />
      <rect x="16" y="124" width="68" height="7" rx="3.5" fill="url(#hgFrame)" />

      {/* Glass body */}
      <path
        d="M22 18 L78 18 L54 70 L78 122 L22 122 L46 70 Z"
        stroke="url(#hgFrame)"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="rgba(212,175,55,0.06)"
      />

      {/* Sand: top (drains toward neck) */}
      <path className="hg-sand-top" d="M27 22 L73 22 L50 66 Z" fill="url(#hgSand)" />

      {/* Sand: bottom (piles up) */}
      <path className="hg-sand-bottom" d="M50 74 L74 118 L26 118 Z" fill="url(#hgSand)" />

      {/* Falling stream */}
      <rect className="hg-stream" x="48.5" y="66" width="3" height="11" rx="1.5" fill="#f4d03f" />
    </svg>
  );
}

type LoadingScreenProps = {
  label?: string;
  tagline?: string;
  showTagline?: boolean;
  size?: number;
  fullScreen?: boolean;
  className?: string;
};

export default function LoadingScreen({
  label,
  tagline = 'The Art of Timeless Beauty',
  showTagline = true,
  size = 96,
  fullScreen = true,
  className = '',
}: LoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading'}
      className={`${
        fullScreen ? 'min-h-screen w-full' : 'py-16'
      } flex items-center justify-center bg-dark hg-glow ${className}`}
    >
      <div className="flex flex-col items-center text-center px-6">
        <Hourglass size={size} />
        {showTagline && (
          <p className="hg-tagline mt-7 text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.32em]">
            {tagline}
          </p>
        )}
        {label && <p className="mt-3 text-sm text-white/55">{label}</p>}
      </div>
    </div>
  );
}
