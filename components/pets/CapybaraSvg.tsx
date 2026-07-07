export default function CapybaraSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* jeruk di kepala (hanya varian yuzu) */}
      <g className="pet-tail" style={{ transformOrigin: "32px 12px" }}>
        <circle cx="32" cy="10.5" r="4.6" fill="var(--pet-patch-b, transparent)" />
        <circle cx="32" cy="6.5" r="1.1" fill="var(--pet-patch-b, transparent)" opacity="0.7" />
      </g>
      {/* badan kotak-bulat khas capybara */}
      <rect x="12" y="30" width="40" height="26" rx="13" fill="var(--pet-body)" />
      {/* kepala menyatu */}
      <rect x="17" y="13" width="30" height="26" rx="12" fill="var(--pet-body)" />
      {/* telinga kecil */}
      <circle cx="22" cy="15.5" r="3.4" fill="var(--pet-body)" />
      <circle cx="42" cy="15.5" r="3.4" fill="var(--pet-body)" />
      <circle cx="22.4" cy="16" r="1.6" fill="var(--pet-ear)" />
      <circle cx="41.6" cy="16" r="1.6" fill="var(--pet-ear)" />
      {/* moncong */}
      <rect x="24.5" y="26" width="15" height="10" rx="5" fill="var(--pet-patch-a, rgba(26,26,46,0.18))" />
      {/* mata santai */}
      <g className="pet-eyes">
        <circle cx="25.5" cy="23" r="2.2" fill="#1a1a2e" />
        <circle cx="38.5" cy="23" r="2.2" fill="#1a1a2e" />
        <circle cx="26.3" cy="22.2" r="0.75" fill="#fff" />
        <circle cx="39.3" cy="22.2" r="0.75" fill="#fff" />
      </g>
      <g className="pet-eyes-closed">
        <path d="M23.3 23 Q25.5 24.8 27.7 23" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M36.3 23 Q38.5 24.8 40.7 23" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
      {/* hidung + mulut datar tenang */}
      <ellipse cx="32" cy="29.5" rx="2" ry="1.4" fill="#2b2b36" />
      <path d="M29 33 Q32 34.4 35 33" stroke="#1a1a2e" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {/* pipi */}
      <circle cx="20.5" cy="28" r="2.6" fill="var(--pet-ear)" opacity="0.7" />
      <circle cx="43.5" cy="28" r="2.6" fill="var(--pet-ear)" opacity="0.7" />
      {/* kaki mungil */}
      <rect x="20" y="53" width="7" height="4.5" rx="2.2" fill="var(--pet-body)" />
      <rect x="37" y="53" width="7" height="4.5" rx="2.2" fill="var(--pet-body)" />
    </svg>
  );
}
