export default function HorseSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* badan */}
      <ellipse cx="32" cy="50" rx="15" ry="9.5" fill="var(--pet-body)" />
      {/* ekor = rambut (goyang) */}
      <path className="pet-tail" style={{ transformOrigin: "46px 48px" }} d="M46 46 Q54 48 52 57" fill="none" stroke="var(--pet-patch-a, rgba(26,26,46,0.35))" strokeWidth="4.5" strokeLinecap="round" />
      {/* telinga */}
      <path d="M22 13 L20 4 L27 9 Z" fill="var(--pet-body)" />
      <path d="M42 13 L44 4 L37 9 Z" fill="var(--pet-body)" />
      <path d="M22.5 11.5 L21.5 7 L25 9.5 Z" fill="var(--pet-ear)" />
      <path d="M41.5 11.5 L42.5 7 L39 9.5 Z" fill="var(--pet-ear)" />
      {/* kepala panjang */}
      <path d="M20 18 Q20 8 32 8 Q44 8 44 18 L42 28 Q40 36 32 36 Q24 36 22 28 Z" fill="var(--pet-body)" />
      {/* poni/surai */}
      <path d="M24 9 Q32 3 40 9 Q36 12 32 11 Q28 12 24 9 Z" fill="var(--pet-patch-a, rgba(26,26,46,0.35))" />
      {/* moncong */}
      <ellipse cx="32" cy="31" rx="8" ry="6" fill="var(--pet-ear)" opacity="0.9" />
      {/* lubang hidung */}
      <circle cx="28.5" cy="31.5" r="1.1" fill="#1a1a2e" opacity="0.75" />
      <circle cx="35.5" cy="31.5" r="1.1" fill="#1a1a2e" opacity="0.75" />
      {/* mata */}
      <g className="pet-eyes">
        <circle cx="26" cy="20" r="2.5" fill="#1a1a2e" />
        <circle cx="38" cy="20" r="2.5" fill="#1a1a2e" />
        <circle cx="26.9" cy="19.1" r="0.85" fill="#fff" />
        <circle cx="38.9" cy="19.1" r="0.85" fill="#fff" />
      </g>
      <g className="pet-eyes-closed">
        <path d="M23.5 20 Q26 22 28.5 20" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M35.5 20 Q38 22 40.5 20" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
      {/* mulut senyum */}
      <path d="M29.5 34.5 Q32 36 34.5 34.5" stroke="#1a1a2e" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* kaki */}
      <rect x="22" y="55" width="5.5" height="5" rx="2" fill="var(--pet-body)" />
      <rect x="36.5" y="55" width="5.5" height="5" rx="2" fill="var(--pet-body)" />
    </svg>
  );
}
