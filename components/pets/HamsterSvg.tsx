export default function HamsterSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* ekor mungil */}
      <circle className="pet-tail" style={{ transformOrigin: "49px 50px" }} cx="49" cy="50" r="3" fill="var(--pet-tail-color, var(--pet-body))" />
      {/* telinga */}
      <circle cx="21" cy="21" r="6" fill="var(--pet-ear-outer, var(--pet-body))" />
      <circle cx="43" cy="21" r="6" fill="var(--pet-ear-outer, var(--pet-body))" />
      <circle cx="21.5" cy="21.5" r="3" fill="var(--pet-ear)" />
      <circle cx="42.5" cy="21.5" r="3" fill="var(--pet-ear)" />
      {/* badan bulat */}
      <circle cx="32" cy="38" r="19" fill="var(--pet-body)" />
      {/* perut */}
      <ellipse cx="32" cy="46" rx="10.5" ry="8.5" fill="var(--pet-patch-a, rgba(255,255,255,0.75))" />
      {/* pipi gembul */}
      <circle cx="19" cy="41" r="5.5" fill="var(--pet-ear)" opacity="0.85" />
      <circle cx="45" cy="41" r="5.5" fill="var(--pet-ear)" opacity="0.85" />
      {/* mata */}
      <g className="pet-eyes">
        <circle cx="26" cy="34" r="2.5" fill="#1a1a2e" />
        <circle cx="38" cy="34" r="2.5" fill="#1a1a2e" />
        <circle cx="26.9" cy="33" r="0.85" fill="#fff" />
        <circle cx="38.9" cy="33" r="0.85" fill="#fff" />
      </g>
      <g className="pet-eyes-closed">
        <path d="M23.5 34 Q26 36 28.5 34" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M35.5 34 Q38 36 40.5 34" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
      {/* hidung + mulut */}
      <path d="M31 38 L33 38 L32 39.4 Z" fill="#e58794" />
      <path d="M32 39.4 Q32 41 30.2 41.3 M32 39.4 Q32 41 33.8 41.3" stroke="#1a1a2e" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* biji kuaci di tangan :3 */}
      <ellipse cx="32" cy="51" rx="2.2" ry="3.2" fill="#6b4e2e" transform="rotate(18 32 51)" />
      <path d="M31.2 48.6 L32.8 48.6" stroke="#f3e3c3" strokeWidth="0.8" strokeLinecap="round" transform="rotate(18 32 51)" />
      {/* kaki */}
      <ellipse cx="26" cy="55.5" rx="4" ry="2.6" fill="var(--pet-body)" />
      <ellipse cx="38" cy="55.5" rx="4" ry="2.6" fill="var(--pet-body)" />
    </svg>
  );
}
