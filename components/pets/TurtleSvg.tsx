export default function TurtleSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* ekor kecil */}
      <path className="pet-tail" style={{ transformOrigin: "50px 48px" }} d="M50 48 L56 45 L53 51 Z" fill="var(--pet-body)" />
      {/* kaki */}
      <ellipse cx="17" cy="51" rx="5" ry="3.5" fill="var(--pet-body)" />
      <ellipse cx="47" cy="51" rx="5" ry="3.5" fill="var(--pet-body)" />
      {/* tempurung */}
      <path d="M12 48 Q12 26 32 26 Q52 26 52 48 Z" fill="var(--pet-patch-a, rgba(26,26,46,0.28))" />
      {/* motif tempurung */}
      <g fill="var(--pet-patch-b, rgba(255,255,255,0.3))">
        <circle cx="25" cy="38" r="3.4" />
        <circle cx="39" cy="38" r="3.4" />
        <circle cx="32" cy="44" r="3.4" />
      </g>
      {/* garis bawah tempurung */}
      <rect x="12" y="47" width="40" height="3.4" rx="1.7" fill="var(--pet-patch-b, rgba(255,255,255,0.3))" />
      {/* kepala */}
      <circle cx="32" cy="20" r="10.5" fill="var(--pet-body)" />
      {/* pipi */}
      <circle cx="25.5" cy="23" r="2.8" fill="var(--pet-ear)" opacity="0.8" />
      <circle cx="38.5" cy="23" r="2.8" fill="var(--pet-ear)" opacity="0.8" />
      {/* mata */}
      <g className="pet-eyes">
        <circle cx="28" cy="19" r="2.2" fill="#1a1a2e" />
        <circle cx="36" cy="19" r="2.2" fill="#1a1a2e" />
        <circle cx="28.8" cy="18.2" r="0.75" fill="#fff" />
        <circle cx="36.8" cy="18.2" r="0.75" fill="#fff" />
      </g>
      <g className="pet-eyes-closed">
        <path d="M25.8 19 Q28 20.8 30.2 19" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M33.8 19 Q36 20.8 38.2 19" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
      {/* mulut */}
      <path d="M29.5 24 Q32 26.2 34.5 24" stroke="#1a1a2e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
