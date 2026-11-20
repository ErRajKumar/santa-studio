import React from 'react';

const STARS = [
  { left: '6%', top: '8%', size: 2, delay: '0s', duration: '4.2s' },
  { left: '14%', top: '18%', size: 3, delay: '1.4s', duration: '5.5s' },
  { left: '22%', top: '6%', size: 2, delay: '2.1s', duration: '4.6s' },
  { left: '31%', top: '14%', size: 2.5, delay: '0.8s', duration: '6s' },
  { left: '42%', top: '9%', size: 2, delay: '3.1s', duration: '4.8s' },
  { left: '53%', top: '16%', size: 3, delay: '1.9s', duration: '5.2s' },
  { left: '64%', top: '7%', size: 2, delay: '0.5s', duration: '4.4s' },
  { left: '72%', top: '21%', size: 2.5, delay: '2.6s', duration: '5.8s' },
  { left: '84%', top: '11%', size: 2, delay: '1.1s', duration: '4.9s' },
  { left: '92%', top: '19%', size: 3, delay: '2.9s', duration: '5.4s' },
  { left: '10%', top: '36%', size: 2, delay: '1.7s', duration: '6.2s' },
  { left: '27%', top: '42%', size: 2, delay: '0.4s', duration: '5.1s' },
  { left: '68%', top: '38%', size: 2.5, delay: '2.3s', duration: '4.7s' },
  { left: '89%', top: '44%', size: 2, delay: '1.2s', duration: '5.6s' },
];

const SNOWFLAKES = [
  { left: '5%', size: 4, duration: '15s', delay: '0s' },
  { left: '13%', size: 3, duration: '19s', delay: '-4s' },
  { left: '22%', size: 5, duration: '16s', delay: '-9s' },
  { left: '33%', size: 3.5, duration: '21s', delay: '-2s' },
  { left: '44%', size: 4.5, duration: '17s', delay: '-11s' },
  { left: '55%', size: 3, duration: '20s', delay: '-6s' },
  { left: '66%', size: 5, duration: '15.5s', delay: '-13s' },
  { left: '75%', size: 3.5, duration: '18.5s', delay: '-3s' },
  { left: '84%', size: 4.5, duration: '16.5s', delay: '-8s' },
  { left: '93%', size: 3, duration: '22s', delay: '-14s' },
  { left: '49%', size: 4, duration: '18s', delay: '-1s' },
  { left: '18%', size: 3, duration: '23s', delay: '-7s' },
];

const FAIRY_BULBS = [
  { color: '#D8B56D', delay: '0s' },
  { color: '#B9D9EC', delay: '0.6s' },
  { color: '#A92332', delay: '1.2s' },
  { color: '#D8B56D', delay: '1.8s' },
  { color: '#F8F1E5', delay: '0.4s' },
  { color: '#B9D9EC', delay: '1.0s' },
  { color: '#D8B56D', delay: '1.6s' },
  { color: '#A92332', delay: '0.2s' },
  { color: '#F8F1E5', delay: '0.9s' },
  { color: '#D8B56D', delay: '1.5s' },
  { color: '#B9D9EC', delay: '2.1s' },
  { color: '#D8B56D', delay: '0.7s' },
];

export const WinterAtmosphere: React.FC<{ variant?: 'homepage' | 'editor' }> = ({
  variant = 'homepage',
}) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Deep Midnight Sky Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 78% 12%, rgba(28, 62, 92, 0.45) 0%, rgba(9, 23, 37, 0.96) 55%, #07121E 100%)',
        }}
      />

      {/* Softly Glowing Moon */}
      {variant === 'homepage' && (
        <div className="absolute right-[7%] top-[7%] hidden sm:block">
          <div className="relative h-24 w-24 rounded-full bg-[#F8F1E5]/90 shadow-[0_0_70px_22px_rgba(216,181,109,0.22)]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#F8F1E5] to-[#D8B56D]/70" />
          </div>
        </div>
      )}

      {/* Drifting Subtle Winter Clouds */}
      <div className="animate-cloud-drift absolute -left-[10%] top-[12%] h-40 w-[55%] rounded-full bg-[#B9D9EC]/[0.03] blur-3xl" />
      <div
        className="animate-cloud-drift absolute right-[-8%] top-[24%] h-48 w-[48%] rounded-full bg-[#D8B56D]/[0.025] blur-3xl"
        style={{ animationDelay: '-18s' }}
      />

      {/* Twinkling Stars */}
      {STARS.map((star, idx) => (
        <span
          key={idx}
          className="animate-twinkle absolute rounded-full bg-[#F8F1E5]"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {/* Distant Illustrated Santa Sleigh & Reindeer Silhouette (Homepage only) */}
      {variant === 'homepage' && (
        <div className="animate-sleigh-glide absolute top-[11%] left-0 opacity-30">
          <svg
            width="170"
            height="42"
            viewBox="0 0 170 42"
            fill="none"
            className="text-[#D8B56D]"
          >
            {/* Sleigh */}
            <path
              d="M8 29C14 29 22 28 28 24L35 16H49L46 25C49 27 53 28 56 26M6 32H51C55 32 58 29 59 26"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M25 16C25 12 29 10 32 12C34 14 33 17 33 17"
              fill="currentColor"
            />
            {/* Reins */}
            <path
              d="M49 21L136 16"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeDasharray="2 2"
              opacity="0.7"
            />
            {/* Three Reindeer Silhouettes */}
            {[84, 114, 144].map((rx, i) => (
              <g key={i} transform={`translate(${rx}, ${i % 2 === 0 ? 11 : 9})`}>
                <ellipse cx="0" cy="8" rx="8" ry="4" fill="currentColor" />
                <path
                  d="M5 6L9 1M9 1L12 -2M9 1L7 -2M-5 10L-8 17M3 10L6 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Subtle Evergreen Branches Framing Top Corners (Homepage) */}
      {variant === 'homepage' && (
        <>
          <svg
            viewBox="0 0 220 140"
            className="absolute left-0 top-0 h-28 w-44 opacity-25 sm:h-36 sm:w-56"
            fill="none"
          >
            <path
              d="M-10 10C45 18 98 42 156 82"
              stroke="#1D4A35"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M18 14L42 2M38 20L66 8M62 28L94 18M86 42L120 35M112 56L144 52M24 22L10 46M52 32L40 60M82 46L74 74M114 62L108 90"
              stroke="#2D6A4E"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M22 14C34 11 45 16 56 22M66 28C80 26 92 32 104 38"
              stroke="#F8F1E5"
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="52" cy="30" r="3.5" fill="#A92332" />
            <circle cx="96" cy="48" r="3.5" fill="#D8B56D" />
          </svg>

          <svg
            viewBox="0 0 220 140"
            className="absolute right-0 top-0 h-28 w-44 -scale-x-100 opacity-25 sm:h-36 sm:w-56"
            fill="none"
          >
            <path
              d="M-10 10C45 18 98 42 156 82"
              stroke="#1D4A35"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M18 14L42 2M38 20L66 8M62 28L94 18M86 42L120 35M112 56L144 52M24 22L10 46M52 32L40 60M82 46L74 74"
              stroke="#2D6A4E"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="52" cy="30" r="3.5" fill="#A92332" />
            <circle cx="96" cy="48" r="3.5" fill="#D8B56D" />
          </svg>

          {/* Subtle Top Fairy Lights Strand */}
          <div className="absolute inset-x-0 top-0 hidden justify-around px-16 sm:flex">
            {FAIRY_BULBS.map((bulb, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-2.5 w-px bg-[#D8B56D]/25" />
                <span
                  className="animate-bulb-glow h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: bulb.color,
                    boxShadow: `0 0 10px 2px ${bulb.color}66`,
                    animationDelay: bulb.delay,
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Gentle Falling Snowflakes */}
      {SNOWFLAKES.map((flake, idx) => (
        <span
          key={idx}
          className="animate-snowfall absolute top-0 rounded-full bg-white/75"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
          }}
        />
      ))}
    </div>
  );
};
