import React from 'react';

type HourglassProps = {
  size?: number;
  className?: string;
};

const HG_DUR = '3.6s';
const HG_EASE = '0.37 0 0.25 1';
const HG_HOLD = '0 0 1 1';

export function Hourglass({ size = 96, className = '' }: HourglassProps) {
  return (
    <svg
      width={size}
      height={(size * 140) / 100}
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hgSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#efd07f" />
          <stop offset="100%" stopColor="#c89b34" />
        </linearGradient>
        <linearGradient id="hgFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e7c66b" />
          <stop offset="60%" stopColor="#c89b34" />
          <stop offset="100%" stopColor="#9c7c2a" />
        </linearGradient>
        <clipPath id="hgTop">
          <rect x="22" width="56" y="22" height="44">
            <animate
              attributeName="y"
              dur={HG_DUR}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.58;1"
              values="22;66;66"
              keySplines={`${HG_EASE};${HG_HOLD}`}
            />
            <animate
              attributeName="height"
              dur={HG_DUR}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.58;1"
              values="44;0;0"
              keySplines={`${HG_EASE};${HG_HOLD}`}
            />
          </rect>
        </clipPath>
        <clipPath id="hgBot">
          <rect x="22" width="56" y="118" height="0">
            <animate
              attributeName="y"
              dur={HG_DUR}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.58;1"
              values="118;74;74"
              keySplines={`${HG_EASE};${HG_HOLD}`}
            />
            <animate
              attributeName="height"
              dur={HG_DUR}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.58;1"
              values="0;44;44"
              keySplines={`${HG_EASE};${HG_HOLD}`}
            />
          </rect>
        </clipPath>
      </defs>

      <g>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur={HG_DUR}
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.70;1"
          values="0 50 70;0 50 70;180 50 70"
          keySplines={`${HG_HOLD};0.45 0 0.15 1`}
        />

        <rect x="18" y="9" width="64" height="7" rx="3.5" fill="url(#hgFrame)" />
        <rect x="18" y="124" width="64" height="7" rx="3.5" fill="url(#hgFrame)" />

        <path
          d="M24 18 L76 18 L53 70 L76 122 L24 122 L47 70 Z"
          stroke="url(#hgFrame)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          fill="rgba(212,175,55,0.05)"
        />

        <path d="M28 22 L72 22 L50 66 Z" fill="url(#hgSand)" clipPath="url(#hgTop)" />
        <path d="M50 74 L72 118 L28 118 Z" fill="url(#hgSand)" clipPath="url(#hgBot)" />

        <rect x="48.7" y="66" width="2.6" height="9" rx="1.3" fill="#e7c150">
          <animate
            attributeName="opacity"
            dur={HG_DUR}
            repeatCount="indefinite"
            keyTimes="0;0.10;0.50;0.60;1"
            values="0;1;1;0;0"
          />
        </rect>
      </g>
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
