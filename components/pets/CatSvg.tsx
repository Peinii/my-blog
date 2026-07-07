export default function CatSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* ekor */}
      <path className="pet-tail" d="M50 46 Q62 42 58 30" fill="none" stroke="var(--pet-tail-color, var(--pet-body))" strokeWidth="5" strokeLinecap="round" />
      {/* badan */}
      <ellipse cx="32" cy="48" rx="18" ry="12" fill="var(--pet-body)" />
      {/* bercak badan (calico/tabby) */}
      <ellipse cx="40" cy="47" rx="7" ry="5" fill="var(--pet-patch-b, transparent)" />
      {/* kepala */}
      <circle cx="32" cy="28" r="15" fill="var(--pet-body)" />
      {/* bercak kepala */}
      <path d="M22 17 Q28 11 34 15 L31 23 Q25 25 22 17 Z" fill="var(--pet-patch-a, transparent)" />
      {/* telinga */}
      <path d="M20 20 L18 8 L28 15 Z" fill="var(--pet-ear-outer, var(--pet-body))" />
      <path d="M44 20 L46 8 L36 15 Z" fill="var(--pet-ear-outer, var(--pet-body))" />
      <path d="M21 17 L20 11 L25 14.5 Z" fill="var(--pet-ear)" />
      <path d="M43 17 L44 11 L39 14.5 Z" fill="var(--pet-ear)" />
      {/* mata */}
      <g className="pet-eyes">
        <circle cx="26" cy="27" r="2.6" fill="#1a1a2e" />
        <circle cx="38" cy="27" r="2.6" fill="#1a1a2e" />
        <circle cx="27" cy="26" r="0.9" fill="#fff" />
        <circle cx="39" cy="26" r="0.9" fill="#fff" />
      </g>
      {/* mata tidur */}
      <g className="pet-eyes-closed">
        <path d="M23 27 Q26 29 29 27" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M35 27 Q38 29 41 27" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
      {/* hidung & mulut */}
      <path d="M31 32 L33 32 L32 33.6 Z" fill="var(--pet-ear)" />
      <path d="M32 33.6 Q32 35.5 29.5 35.8 M32 33.6 Q32 35.5 34.5 35.8" stroke="#1a1a2e" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {/* kumis */}
      <g stroke="#1a1a2e" strokeWidth="0.9" strokeLinecap="round" opacity="0.65">
        <path d="M18 30 L10 29" /><path d="M18 33 L10.5 34.5" />
        <path d="M46 30 L54 29" /><path d="M46 33 L53.5 34.5" />
      </g>
      {/* kaki depan */}
      <ellipse cx="24" cy="57" rx="4.5" ry="3" fill="var(--pet-body)" />
      <ellipse cx="40" cy="57" rx="4.5" ry="3" fill="var(--pet-body)" />
    </svg>
  );
}
