export default function BunnySvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* telinga (goyang pelan) */}
      <g className="pet-tail" style={{ transformOrigin: "32px 24px" }}>
        <ellipse cx="24" cy="12" rx="5.5" ry="12" transform="rotate(-10 24 12)" fill="var(--pet-body)" />
        <ellipse cx="40" cy="12" rx="5.5" ry="12" transform="rotate(10 40 12)" fill="var(--pet-body)" />
        <ellipse cx="24.5" cy="13" rx="2.6" ry="8" transform="rotate(-10 24.5 13)" fill="var(--pet-ear)" />
        <ellipse cx="39.5" cy="13" rx="2.6" ry="8" transform="rotate(10 39.5 13)" fill="var(--pet-ear)" />
      </g>
      {/* ekor pom-pom */}
      <circle cx="47" cy="52" r="4.5" fill="var(--pet-tail-color, #ffffff)" opacity="0.95" />
      {/* badan */}
      <ellipse cx="32" cy="47" rx="16" ry="12" fill="var(--pet-body)" />
      {/* kepala */}
      <circle cx="32" cy="30" r="14" fill="var(--pet-body)" />
      {/* pipi */}
      <circle cx="23" cy="34" r="3.6" fill="var(--pet-ear)" opacity="0.8" />
      <circle cx="41" cy="34" r="3.6" fill="var(--pet-ear)" opacity="0.8" />
      {/* mata */}
      <g className="pet-eyes">
        <circle cx="26.5" cy="29" r="2.5" fill="#1a1a2e" />
        <circle cx="37.5" cy="29" r="2.5" fill="#1a1a2e" />
        <circle cx="27.4" cy="28" r="0.85" fill="#fff" />
        <circle cx="38.4" cy="28" r="0.85" fill="#fff" />
      </g>
      <g className="pet-eyes-closed">
        <path d="M24 29 Q26.5 31 29 29" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M35 29 Q37.5 31 40 29" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
      {/* hidung + mulut */}
      <path d="M31 33 L33 33 L32 34.5 Z" fill="var(--pet-ear)" />
      <path d="M32 34.5 Q32 36.2 30 36.6 M32 34.5 Q32 36.2 34 36.6" stroke="#1a1a2e" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {/* gigi kecil */}
      <rect x="30.6" y="36.8" width="2.8" height="2.6" rx="0.8" fill="#fff" stroke="#1a1a2e" strokeWidth="0.5" />
      {/* kaki depan */}
      <ellipse cx="25" cy="56" rx="4.5" ry="3" fill="var(--pet-body)" />
      <ellipse cx="39" cy="56" rx="4.5" ry="3" fill="var(--pet-body)" />
    </svg>
  );
}
