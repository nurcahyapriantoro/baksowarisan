import React from 'react';

const BAKSO_ICONS = [
  { top: '6%', size: 56, delay: 0, duration: 22 },
  { top: '20%', size: 40, delay: 4, duration: 26 },
  { top: '42%', size: 48, delay: 8, duration: 24 },
  { top: '60%', size: 32, delay: 2, duration: 18 },
  { top: '76%', size: 64, delay: 6, duration: 30 }
];

export function BaksoBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-30 pointer-events-none">
      <style>{`
        .bakso-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden}
        .bakso-item{position:absolute;left:-12%;opacity:0.85;border-radius:9999px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 8px 20px rgba(10,15,30,0.06));transform:translateX(-10%)}
        @keyframes bakso-move{0%{transform:translateX(-18%) translateY(0) rotate(0deg);opacity:0}20%{opacity:0.9}50%{transform:translateX(48%) translateY(-6%) rotate(15deg)}80%{opacity:0.9}100%{transform:translateX(120%) translateY(0) rotate(30deg);opacity:0}}
        .bakso-item{animation-name:bakso-move;animation-timing-function:linear;animation-iteration-count:infinite}
        @media (prefers-reduced-motion: reduce){.bakso-item{animation: none;opacity:0.25}}
      `}</style>

      <div className="bakso-bg">
        {BAKSO_ICONS.map((b, i) => (
          <div
            key={i}
            className="bakso-item"
            style={{
              top: b.top,
              width: b.size,
              height: b.size,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`
            }}
          >
            <svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <defs>
                <radialGradient id={`g-bakso-${i}`} cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fff3e0" />
                  <stop offset="60%" stopColor="#ffddca" />
                  <stop offset="100%" stopColor="#f29a66" />
                </radialGradient>
              </defs>
              <g>
                <circle cx="32" cy="32" r="30" fill={`url(#g-bakso-${i})`} opacity="0.95" />
                <circle cx="22" cy="26" r="3.8" fill="#8b4a34" opacity="0.9" />
                <circle cx="36" cy="20" r="3" fill="#8b4a34" opacity="0.9" />
                <circle cx="44" cy="34" r="4" fill="#8b4a34" opacity="0.9" />
                <circle cx="30" cy="40" r="2.6" fill="#8b4a34" opacity="0.9" />
              </g>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BaksoBackground;
