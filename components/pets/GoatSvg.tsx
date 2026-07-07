export default function GoatSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* tanduk */}
      <path d="M23 12 Q19 6 22 2 Q26 6 26.5 11 Z" fill="var(--pet-patch-a, #d8cbb6)" />
      <path d="M41 12 Q45 6 42 2 Q38 6 37.5 11 Z" fill="var(--pet-patch-a, #d8cbb6)" />
      {/* telinga samping (goyang) */}
      <g className="pet-tail" style={{ transformOrigin: "32px 18px" }}>
        <ellipse cx="17" cy="20" rx="7" ry="3.6" transform="rotate(-14 17 20)" fill="var(--pet-body)" />
        <ellipse cx="47" cy="20" rx="7" ry="3.6" transform="rotate(14 47 20)" fill="var(--pet-body)" />
        <ellipse cx="16.5" cy="20.3" rx="4" ry="1.8" transform="rotate(-14 16.5 20.3)" fill="var(--pet-ear)" />
        <ellipse cx="47.5" cy="20.3" rx="4" ry="1.8" transform="rotate(14 47.5 20.3)" fill="var(--pet-ear)" />
      </g>
      {/* badan */}
      <ellipse cx="32" cy="49" rx="16" ry="10.5" fill="var(--pet-body)" />
      {/* bercak badan (black & white) */}
      <ellipse cx="39" cy="48" rx="6.5" ry="4.5" fill="var(--pet-patch-b, transparent)" />
      {/* kepala */}
      <path d="M20 20 Q20 11 32 11 Q44 11 44 20 L42 30 Q40 37 32 37 Q24 37 22 30 Z" fill="var(--pet-body)" />
      {/* mata */}
      <g className="pet-eyes">
        <circle cx="26.5" cy="22" r="2.4" fill="#1a1a2e" />
        <circle cx="37.5" cy="22" r="2.4" fill="#1a1a2e" />
        <circle cx="27.3" cy="21.1" r="0.8" fill="#fff" />
        <circle cx="38.3" cy="21.1" r="0.8" fill="#fff" />
      </g>
      <g className="pet-eyes-closed">
        <path d="M24 22 Q26.5 24 29 22" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M35 22 Q37.5 24 40 22" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
      {/* hidung + mulut */}
      <path d="M31 28.5 L33 28.5 L32 30 Z" fill="#e58794" />
      <path d="M32 30 Q32 32 30 32.3 M32 30 Q32 32 34 32.3" stroke="#1a1a2e" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {/* janggut kecil */}
      <path d="M30 36.5 Q32 41.5 34 36.5 Z" fill="var(--pet-body)" />
      {/* pipi */}
      <circle cx="23" cy="26.5" r="2.6" fill="var(--pet-ear)" opacity="0.7" />
      <circle cx="41" cy="26.5" r="2.6" fill="var(--pet-ear)" opacity="0.7" />
      {/* kaki */}
      <rect x="23" y="55" width="5" height="5" rx="2" fill="var(--pet-body)" />
      <rect x="36" y="55" width="5" height="5" rx="2" fill="var(--pet-body)" />
    </svg>
  );
}
