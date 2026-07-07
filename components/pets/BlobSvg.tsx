export default function BlobSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" className={className} xmlns="http://www.w3.org/2000/svg">
      <g className="pet-blob-body" style={{ transformOrigin: "32px 58px" }}>
        {/* badan kenyal */}
        <path
          d="M32 10
             C46 10 54 22 54 36
             C54 50 46 58 32 58
             C18 58 10 50 10 36
             C10 22 18 10 32 10 Z"
          fill="var(--pet-body)"
        />
        {/* kilau */}
        <ellipse cx="24" cy="20" rx="6" ry="3.5" transform="rotate(-24 24 20)" fill="rgba(255,255,255,0.4)" />
        {/* pipi */}
        <circle cx="21" cy="40" r="4" fill="var(--pet-ear)" opacity="0.85" />
        <circle cx="43" cy="40" r="4" fill="var(--pet-ear)" opacity="0.85" />
        {/* mata */}
        <g className="pet-eyes">
          <circle cx="25" cy="34" r="2.8" fill="#1a1a2e" />
          <circle cx="39" cy="34" r="2.8" fill="#1a1a2e" />
          <circle cx="26" cy="33" r="1" fill="#fff" />
          <circle cx="40" cy="33" r="1" fill="#fff" />
        </g>
        <g className="pet-eyes-closed">
          <path d="M22 34 Q25 36 28 34" stroke="#1a1a2e" strokeWidth="1.7" fill="none" strokeLinecap="round" />
          <path d="M36 34 Q39 36 42 34" stroke="#1a1a2e" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        </g>
        {/* mulut */}
        <path d="M29 40 Q32 43 35 40" stroke="#1a1a2e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
