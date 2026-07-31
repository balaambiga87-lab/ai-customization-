import { BandKey } from "@/lib/types";

export function BandSVG({ style, size = 320 }: { style: BandKey; size?: number }) {
  const gradId = `band-grad-${style}`;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--metal-hi)" />
          <stop offset="45%" stopColor="var(--metal)" />
          <stop offset="100%" stopColor="var(--metal-lo)" />
        </linearGradient>
      </defs>

      {style === "classic" && (
        <path
          d="M10 55 A40 40 0 0 1 90 55"
          stroke={`url(#${gradId})`}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
        />
      )}

      {style === "twist" && (
        <>
          <path
            d="M8 58 A42 42 0 0 1 92 58"
            stroke={`url(#${gradId})`}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M14 66 A36 36 0 0 1 86 66"
            stroke="var(--metal-lo)"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            opacity={0.8}
          />
        </>
      )}

      {style === "pave" && (
        <>
          <path
            d="M10 55 A40 40 0 0 1 90 55"
            stroke={`url(#${gradId})`}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
          />
          {[20, 32, 44, 56, 68, 80].map((x) => (
            <circle
              key={x}
              cx={x}
              cy={55 - Math.sin(((x - 10) / 80) * Math.PI) * 8}
              r={2.6}
              fill="var(--diamond)"
              opacity={0.9}
            />
          ))}
        </>
      )}
    </svg>
  );
}
