export function Logo({ size = 40, withWord = false }: { size?: number; withWord?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="drop-shadow-[0_8px_24px_rgba(34,211,238,0.25)]">
        <defs>
          <linearGradient id="tl-chrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fbff" />
            <stop offset="35%" stopColor="#7dd3fc" />
            <stop offset="68%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <path d="M8 6h48l-8 14H16zM26 18h12v40H26z" fill="url(#tl-chrome)" />
      </svg>
      {withWord ? <span className="text-lg font-semibold tracking-tight chrome-text">TipLoop</span> : null}
    </span>
  );
}
