/** Pembatas section bergelombang lembut, warnanya ikut tema. */
export default function WaveDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="h-6 w-full"
      >
        <path
          d="M0 20 C 150 40 300 0 450 20 C 600 40 750 0 900 20 C 1050 40 1140 10 1200 20 L 1200 40 L 0 40 Z"
          fill="var(--accent-soft)"
        />
        <path
          d="M0 24 C 150 42 300 6 450 24 C 600 42 750 6 900 24 C 1050 42 1140 14 1200 24"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.25"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
