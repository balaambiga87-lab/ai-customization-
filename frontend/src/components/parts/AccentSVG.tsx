export function AccentSVG({ size = 38 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <radialGradient id="accent-grad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="var(--diamond)" />
          <stop offset="100%" stopColor="#9FCBDE" />
        </radialGradient>
      </defs>
      <polygon points="50,20 66,40 50,80 34,40" fill="url(#accent-grad)" stroke="#fff" strokeWidth={1} />
      <polygon points="50,20 58,32 42,32" fill="#fff" opacity={0.4} className="sparkle" />
    </svg>
  );
}
