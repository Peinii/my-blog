export default function DogSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* ekor goyang */}
      <path className="pet-tail" d="M49 47 Q60 44 57 33" fill="none" stroke="var(--pet-tail-color, var(--pet-body))" strokeWidth="5" strokeLinecap="round" />
      {/* badan */}
      <ellipse cx="32" cy="48" rx="17" ry="11.5" fill="var(--pet-body)" />
      {/* dada terang */}
      <ellipse cx="32" cy="51" rx="8" ry="6.5" fill="var(--pet-patch-a, transparent)" opacity="0.9" />
      {/* telinga floppy (di belakang kepala) */}
      <path d="M18 20 Q13 30 18 37 Q23 34 22 24 Z" fill="var(--pet-ear-outer, var(--pet-body))" />
      <path d="M46 20 Q51 30 46 37 Q41 34 42 24 Z" fill="var(--pet-ear-outer, var(--pet-body))" />
      {/* kepala */}
      <circle cx="32" cy="27" r="14.5" fill="var(--pet-body)" />
      {/* moncong terang */}
      <ellipse cx="32" cy="33" rx="7.5" ry="5.5" fill="var(--pet-patch-a, transparent)" opacity="0.9" />
      {/* mata */}
      <g className="pet-eyes">
        <circle cx="26" cy="26" r="2.6" fill="#1a1a2e" />
        <circle cx="38" cy="26" r="2.6" fill="#1a1a2e" />
        <circle cx="27" cy="25" r="0.9" fill="#fff" />
        <circle cx="39" cy="25" r="0.9" fill="#fff" />
      </g>
      <g className="pet-eyes-closed">
        <path d="M23 26 Q26 28 29 26" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M35 26 Q38 28 41 26" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
      {/* hidung + mulut + lidah */}
      <ellipse cx="32" cy="31.5" rx="2.6" ry="2" fill="#2b2b36" />
      <path d="M32 33.5 Q32 35.5 29.5 35.8 M32 33.5 Q32 35.5 34.5 35.8" stroke="#1a1a2e" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M30.5 36 Q32 39.5 33.5 36 Z" fill="#f08a9b" />
      {/* kaki depan */}
      <ellipse cx="24" cy="56.5" rx="4.5" ry="3" fill="var(--pet-body)" />
      <ellipse cx="40" cy="56.5" rx="4.5" ry="3" fill="var(--pet-body)" />
    </svg>
  );
}
