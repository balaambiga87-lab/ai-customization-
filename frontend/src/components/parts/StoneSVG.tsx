import { StoneKey } from "@/lib/types";

export function StoneSVG({ cut, size = 90 }: { cut: StoneKey; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {cut === "round" && (
        <>
          <defs>
            <radialGradient id="stone-round-grad" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="var(--diamond)" />
              <stop offset="100%" stopColor="#9FCBDE" />
            </radialGradient>
          </defs>
          <polygon
            points="50,8 68,22 82,45 68,78 50,92 32,78 18,45 32,22"
            fill="url(#stone-round-grad)"
            stroke="#ffffff"
            strokeWidth={1}
            opacity={0.95}
          />
          <polygon
            points="50,8 68,22 50,42 32,22"
            fill="#ffffff"
            opacity={0.35}
            className="sparkle"
          />
          <polygon points="50,42 82,45 68,78 50,60" fill="#ffffff" opacity={0.18} />
          <polygon points="50,42 50,60 32,78 18,45" fill="#ffffff" opacity={0.28} />
        </>
      )}

      {cut === "princess" && (
        <>
          <defs>
            <linearGradient id="stone-princess-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="var(--diamond)" />
              <stop offset="100%" stopColor="#9FCBDE" />
            </linearGradient>
          </defs>
          <rect x={24} y={24} width={52} height={52} fill="url(#stone-princess-grad)" stroke="#fff" strokeWidth={1} />
          <line x1={24} y1={24} x2={76} y2={76} stroke="#fff" opacity={0.3} />
          <line x1={76} y1={24} x2={24} y2={76} stroke="#fff" opacity={0.3} />
          <rect x={34} y={34} width={12} height={12} fill="#fff" opacity={0.4} className="sparkle" />
        </>
      )}

      {cut === "marquise" && (
        <>
          <defs>
            <linearGradient id="stone-marquise-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="var(--diamond)" />
              <stop offset="100%" stopColor="#9FCBDE" />
            </linearGradient>
          </defs>
          <path
            d="M50 6 C72 30 72 70 50 94 C28 70 28 30 50 6 Z"
            fill="url(#stone-marquise-grad)"
            stroke="#fff"
            strokeWidth={1}
          />
          <path d="M50 6 C58 30 58 70 50 94" stroke="#fff" opacity={0.4} fill="none" />
          <ellipse cx={45} cy={30} rx={5} ry={8} fill="#fff" opacity={0.4} className="sparkle" />
        </>
      )}
    </svg>
  );
}
