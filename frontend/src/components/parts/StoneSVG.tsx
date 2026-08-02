import { StoneKey } from "@/lib/types";

export function StoneSVG({ cut, size = 90 }: { cut: StoneKey; size?: number }) {
  const id = `stone-${cut}-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible" }}>
      {cut === "round" && (
        <>
          <defs>
            {/* Base crystal body */}
            <radialGradient id={`${id}-base`} cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="20%" stopColor="#eef8ff" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#c8e8f8" stopOpacity="0.92" />
              <stop offset="80%" stopColor="#8ab8d8" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#5090b8" stopOpacity="0.85" />
            </radialGradient>

            {/* Table facet highlight */}
            <radialGradient id={`${id}-table`} cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#e0f4ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a0c8e8" stopOpacity="0.1" />
            </radialGradient>

            {/* Fire dispersion gradient - blue */}
            <linearGradient id={`${id}-fire-blue`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4488ff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0033cc" stopOpacity="0.55" />
            </linearGradient>

            {/* Fire dispersion gradient - orange */}
            <linearGradient id={`${id}-fire-orange`} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8800" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ff4400" stopOpacity="0.5" />
            </linearGradient>

            {/* Fire dispersion gradient - violet */}
            <linearGradient id={`${id}-fire-violet`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#9933ff" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#6600cc" stopOpacity="0.45" />
            </linearGradient>

            {/* Fire dispersion gradient - green */}
            <linearGradient id={`${id}-fire-green`} x1="1" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#00cc66" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#009944" stopOpacity="0.35" />
            </linearGradient>

            {/* Dark pavilion reflection */}
            <radialGradient id={`${id}-dark`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a3a55" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0a1f35" stopOpacity="0.75" />
            </radialGradient>

            {/* Clip circle */}
            <clipPath id={`${id}-clip`}>
              <circle cx="50" cy="50" r="42" />
            </clipPath>

            {/* Shimmer animation filter */}
            <filter id={`${id}-glow`}>
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ── Outer girdle ring (slight shadow edge) ── */}
          <circle cx="50" cy="50" r="43" fill="#5080a0" opacity="0.3" />

          {/* ── Base crystal body ── */}
          <circle cx="50" cy="50" r="42" fill={`url(#${id}-base)`} />

          {/* ── Pavilion facets (clipped) ── */}
          <g clipPath={`url(#${id}-clip)`}>

            {/* Dark base pavilion */}
            <circle cx="50" cy="50" r="42" fill={`url(#${id}-dark)`} opacity="0.35" />

            {/* Main kite facets × 8 — alternating light/dark */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 50 + 42 * Math.cos(rad - 0.39);
              const y1 = 50 + 42 * Math.sin(rad - 0.39);
              const x2 = 50 + 42 * Math.cos(rad + 0.39);
              const y2 = 50 + 42 * Math.sin(rad + 0.39);
              const bright = i % 2 === 0;
              return (
                <polygon
                  key={`kite-${i}`}
                  points={`50,50 ${x1},${y1} ${x2},${y2}`}
                  fill={bright ? "#ffffff" : "#1a3a55"}
                  opacity={bright ? 0.22 : 0.28}
                />
              );
            })}

            {/* ── Spectral fire facets — coloured dispersion ── */}
            {/* Blue fire — upper left */}
            <polygon
              points="50,50 22,28 34,10"
              fill={`url(#${id}-fire-blue)`}
              opacity="0.58"
            />
            <polygon
              points="50,50 14,42 20,26"
              fill={`url(#${id}-fire-blue)`}
              opacity="0.42"
            />

            {/* Orange fire — upper right */}
            <polygon
              points="50,50 66,10 78,28"
              fill={`url(#${id}-fire-orange)`}
              opacity="0.55"
            />
            <polygon
              points="50,50 80,42 75,26"
              fill={`url(#${id}-fire-orange)`}
              opacity="0.40"
            />

            {/* Violet fire — lower left */}
            <polygon
              points="50,50 22,72 30,88"
              fill={`url(#${id}-fire-violet)`}
              opacity="0.50"
            />

            {/* Green fire — lower right */}
            <polygon
              points="50,50 78,72 70,88"
              fill={`url(#${id}-fire-green)`}
              opacity="0.45"
            />

            {/* Red fire accent — bottom */}
            <polygon
              points="50,50 42,90 58,90"
              fill="#ee2244"
              opacity="0.32"
            />

            {/* Cyan accent — left */}
            <polygon
              points="50,50 10,54 12,62"
              fill="#00ccee"
              opacity="0.38"
            />

            {/* ── Bright star facet flashes — the "hearts & arrows" pattern ── */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const midRad = ((angle + 22.5) * Math.PI) / 180;
              const cx = 50 + 26 * Math.cos(rad);
              const cy = 50 + 26 * Math.sin(rad);
              const p1x = 50 + 16 * Math.cos(rad - 0.55);
              const p1y = 50 + 16 * Math.sin(rad - 0.55);
              const p2x = 50 + 42 * Math.cos(midRad - 0.22);
              const p2y = 50 + 42 * Math.sin(midRad - 0.22);
              const p3x = 50 + 16 * Math.cos(rad + 0.55);
              const p3y = 50 + 16 * Math.sin(rad + 0.55);
              const bright = i % 2 === 0;
              return (
                <polygon
                  key={`star-${i}`}
                  points={`${p1x},${p1y} ${p2x},${p2y} ${cx},${cy} ${p3x},${p3y}`}
                  fill={bright ? "#ffffff" : "#c8dff0"}
                  opacity={bright ? 0.85 : 0.25}
                  filter={bright ? `url(#${id}-glow)` : undefined}
                />
              );
            })}

            {/* ── Table facet (centre octagon) ── */}
            <polygon
              points="50,30 63,36 66,50 63,64 50,70 37,64 34,50 37,36"
              fill={`url(#${id}-table)`}
              stroke="#ffffff"
              strokeWidth="0.5"
              opacity="0.92"
            />

            {/* ── Culet (tiny centre sparkle) ── */}
            <circle cx="50" cy="50" r="4" fill="#ffffff" opacity="0.65" />
            <circle cx="50" cy="50" r="2" fill="#ffffff" opacity="0.9" />

            {/* ── Specular hot-spot ── */}
            <ellipse cx="40" cy="36" rx="8" ry="5"
              fill="#ffffff" opacity="0.55"
              transform="rotate(-20 40 36)"
            />
            <ellipse cx="36" cy="33" rx="3" ry="2"
              fill="#ffffff" opacity="0.85"
              transform="rotate(-20 36 33)"
            />
          </g>

          {/* ── Girdle rim highlight ── */}
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.45"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#7ab8e0"
            strokeWidth="0.5"
            opacity="0.6"
          />
        </>
      )}

      {cut === "princess" && (
        <>
          <defs>
            <linearGradient id={`${id}-pg`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#e8f6ff" />
              <stop offset="65%" stopColor="#b0d8f0" />
              <stop offset="100%" stopColor="#6090b8" />
            </linearGradient>
            <linearGradient id={`${id}-pb`} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3366ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0022aa" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id={`${id}-po`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff7700" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#cc3300" stopOpacity="0.45" />
            </linearGradient>
            <filter id={`${id}-pglow`}>
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base square */}
          <rect x={20} y={20} width={60} height={60}
            fill={`url(#${id}-pg)`}
            stroke="#c8dff0" strokeWidth="0.8"
          />

          {/* Corner kite facets */}
          <polygon points="20,20 50,50 38,20" fill="#ffffff" opacity="0.55" />
          <polygon points="80,20 50,50 62,20" fill="#d0eaff" opacity="0.30" />
          <polygon points="80,80 50,50 62,80" fill="#ffffff" opacity="0.45" />
          <polygon points="20,80 50,50 38,80" fill="#c0d8f0" opacity="0.28" />

          {/* Side kites */}
          <polygon points="20,20 50,50 20,50" fill="#1a3a66" opacity="0.30" />
          <polygon points="80,20 50,50 80,50" fill="#ffffff" opacity="0.40" />
          <polygon points="20,80 50,50 20,50" fill="#ffffff" opacity="0.25" />
          <polygon points="80,80 50,50 80,50" fill="#1a3a66" opacity="0.28" />

          {/* Fire accents */}
          <polygon points="20,20 35,35 20,38" fill={`url(#${id}-pb)`} opacity="0.65" />
          <polygon points="80,20 65,35 80,38" fill={`url(#${id}-po)`} opacity="0.60" />
          <polygon points="20,80 35,65 20,62" fill="#9922ff" opacity="0.48" />
          <polygon points="80,80 65,65 80,62" fill="#00cc55" opacity="0.42" />

          {/* Diagonal lines */}
          <line x1={20} y1={20} x2={80} y2={80} stroke="#ffffff" opacity="0.3" strokeWidth="0.6" />
          <line x1={80} y1={20} x2={20} y2={80} stroke="#ffffff" opacity="0.3" strokeWidth="0.6" />
          <line x1={50} y1={20} x2={50} y2={80} stroke="#ffffff" opacity="0.18" strokeWidth="0.4" />
          <line x1={20} y1={50} x2={80} y2={50} stroke="#ffffff" opacity="0.18" strokeWidth="0.4" />

          {/* Table octagon */}
          <polygon
            points="38,30 62,30 70,50 62,70 38,70 30,50"
            fill="#e8f4ff" opacity="0.7"
            stroke="#fff" strokeWidth="0.5"
          />

          {/* Centre sparkle */}
          <rect x={45} y={45} width={10} height={10}
            fill="#ffffff" opacity="0.85"
            filter={`url(#${id}-pglow)`}
          />

          {/* Hot-spot */}
          <ellipse cx="32" cy="28" rx="7" ry="4"
            fill="#ffffff" opacity="0.65"
            transform="rotate(-35 32 28)"
          />

          {/* Border */}
          <rect x={20} y={20} width={60} height={60}
            fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.5"
          />
        </>
      )}

      {cut === "marquise" && (
        <>
          <defs>
            <linearGradient id={`${id}-mg`} x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#e4f4ff" />
              <stop offset="65%" stopColor="#a8d4f0" />
              <stop offset="100%" stopColor="#5888b8" />
            </linearGradient>
            <linearGradient id={`${id}-mb`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2255ee" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0011aa" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id={`${id}-mo`} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8800" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#ee3300" stopOpacity="0.45" />
            </linearGradient>
            <clipPath id={`${id}-mclip`}>
              <path d="M50 6 C74 24 78 76 50 94 C22 76 22 24 50 6 Z" />
            </clipPath>
            <filter id={`${id}-mglow`}>
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Shadow edge */}
          <path d="M50 5 C75 23 79 77 50 95 C21 77 21 23 50 5 Z"
            fill="#4878a0" opacity="0.25" />

          {/* Base body */}
          <path d="M50 6 C74 24 78 76 50 94 C22 76 22 24 50 6 Z"
            fill={`url(#${id}-mg)`}
          />

          <g clipPath={`url(#${id}-mclip)`}>
            {/* Left kite facets */}
            <polygon points="50,50 22,50 50,6" fill="#ffffff" opacity="0.50" />
            <polygon points="50,50 22,50 50,94" fill="#1a3a55" opacity="0.30" />

            {/* Right kite facets */}
            <polygon points="50,50 78,50 50,6" fill="#1a3a55" opacity="0.28" />
            <polygon points="50,50 78,50 50,94" fill="#ffffff" opacity="0.42" />

            {/* Blue fire — top left */}
            <polygon points="50,6 30,20 50,35" fill={`url(#${id}-mb)`} opacity="0.60" />
            {/* Orange fire — top right */}
            <polygon points="50,6 70,20 50,35" fill={`url(#${id}-mo)`} opacity="0.55" />
            {/* Violet — bottom left */}
            <polygon points="50,94 30,80 50,65" fill="#9922ff" opacity="0.48" />
            {/* Green — bottom right */}
            <polygon points="50,94 70,80 50,65" fill="#00bb55" opacity="0.42" />
            {/* Cyan — mid left */}
            <polygon points="22,50 35,38 35,62" fill="#00bbdd" opacity="0.40" />
            {/* Red — mid right */}
            <polygon points="78,50 65,40 65,60" fill="#ee1133" opacity="0.35" />

            {/* Upper inner facets */}
            <polygon points="50,6 38,20 50,35 62,20" fill="#ffffff" opacity="0.65"
              filter={`url(#${id}-mglow)`} />

            {/* Lower inner facets */}
            <polygon points="50,94 38,80 50,65 62,80" fill="#d0eaff" opacity="0.45" />

            {/* Central table */}
            <ellipse cx="50" cy="50" rx="14" ry="24"
              fill="#e8f6ff" opacity="0.75"
              stroke="#ffffff" strokeWidth="0.5"
            />

            {/* Culet point top */}
            <ellipse cx="50" cy="18" rx="5" ry="3"
              fill="#ffffff" opacity="0.80"
              filter={`url(#${id}-mglow)`}
            />
            {/* Culet point bottom */}
            <ellipse cx="50" cy="82" rx="5" ry="3"
              fill="#ffffff" opacity="0.70"
            />

            {/* Specular hot-spot */}
            <ellipse cx="42" cy="28" rx="7" ry="4"
              fill="#ffffff" opacity="0.70"
              transform="rotate(-50 42 28)"
            />
            <ellipse cx="40" cy="26" rx="3" ry="1.5"
              fill="#ffffff" opacity="0.90"
              transform="rotate(-50 40 26)"
            />

            {/* Centre star sparkle */}
            <circle cx="50" cy="50" r="3" fill="#ffffff" opacity="0.80" />
          </g>

          {/* Outline */}
          <path d="M50 6 C74 24 78 76 50 94 C22 76 22 24 50 6 Z"
            fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.5"
          />
          {/* Central spine line */}
          <path d="M50 6 C53 30 53 70 50 94"
            stroke="#ffffff" opacity="0.28" fill="none" strokeWidth="0.5"
          />
        </>
      )}
    </svg>
  );
}
