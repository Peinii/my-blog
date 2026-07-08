export default function SealSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* ekor sirip (kibas pelan) */}
      <path
        className="pet-tail"
        style={{ transformOrigin: "47px 54px" }}
        d="M46 52 Q54 48 57 53 Q53 57 46 56 Z"
        fill="var(--pet-body)"
      />
      {/* badan ekstra gendut menyatu dengan kepala */}
      <path
        d="M32 8
           C47 8 54 20 54 35
           C54 50 45 58 32 58
           C19 58 10 50 10 35
           C10 20 17 8 32 8 Z"
        fill="var(--pet-body)"
      />
      {/* perut terang lebar */}
      <ellipse cx="32" cy="45" rx="13.5" ry="12" fill="var(--pet-patch-a, rgba(255,255,255,0.5))" />
      {/* lipatan gendut di pinggang :3 */}
      <path d="M13 30 Q17 32 21 31" stroke="rgba(26,26,46,0.14)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M51 30 Q47 32 43 31" stroke="rgba(26,26,46,0.14)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* sirip samping */}
      <path d="M10 38 Q3 42 4 50 Q12 50 16 45 Z" fill="var(--pet-body)" />
      <path d="M54 38 Q61 42 60 50 Q52 50 48 45 Z" fill="var(--pet-body)" />
      {/* kilau kepala */}
      <ellipse cx="25" cy="15" rx="5" ry="2.8" transform="rotate(-20 25 15)" fill="rgba(255,255,255,0.35)" />
      {/* pipi */}
      <circle cx="21.5" cy="27" r="3.6" fill="var(--pet-ear)" opacity="0.85" />
      <circle cx="42.5" cy="27" r="3.6" fill="var(--pet-ear)" opacity="0.85" />
      {/* mata besar berbinar */}
      <g className="pet-eyes">
        <circle cx="25" cy="22" r="2.9" fill="#1a1a2e" />
        <circle cx="39" cy="22" r="2.9" fill="#1a1a2e" />
        <circle cx="26" cy="21" r="1.05" fill="#fff" />
        <circle cx="40" cy="21" r="1.05" fill="#fff" />
        <circle cx="24.2" cy="23.2" r="0.5" fill="#fff" opacity="0.8" />
        <circle cx="38.2" cy="23.2" r="0.5" fill="#fff" opacity="0.8" />
      </g>
      <g className="pet-eyes-closed">
        <path d="M22 22 Q25 24.2 28 22" stroke="#1a1a2e" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        <path d="M36 22 Q39 24.2 42 22" stroke="#1a1a2e" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      </g>
      {/* moncong: hidung + mulut w */}
      <ellipse cx="32" cy="27.5" rx="2.2" ry="1.6" fill="#2b2b36" />
      <path d="M32 29 Q32 31 29.8 31.3 M32 29 Q32 31 34.2 31.3" stroke="#1a1a2e" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {/* titik kumis */}
      <g fill="#1a1a2e" opacity="0.55">
        <circle cx="26.5" cy="28.5" r="0.55" /><circle cx="24" cy="29.5" r="0.55" /><circle cx="26" cy="30.8" r="0.55" />
        <circle cx="37.5" cy="28.5" r="0.55" /><circle cx="40" cy="29.5" r="0.55" /><circle cx="38" cy="30.8" r="0.55" />
      </g>
    </svg>
  );
}
