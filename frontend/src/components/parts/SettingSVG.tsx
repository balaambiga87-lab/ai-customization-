import { SettingKey } from "@/lib/types";

export function SettingSVG({ kind, size = 110 }: { kind: SettingKey; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {kind === "prong" && (
        <g stroke="var(--metal)" strokeWidth={4} fill="none" strokeLinecap="round">
          <line x1={26} y1={30} x2={20} y2={10} />
          <line x1={74} y1={30} x2={80} y2={10} />
          <line x1={30} y1={76} x2={24} y2={94} />
          <line x1={70} y1={76} x2={76} y2={94} />
        </g>
      )}

      {kind === "bezel" && (
        <circle cx={50} cy={50} r={46} fill="none" stroke="var(--metal)" strokeWidth={7} />
      )}

      {kind === "halo" && (
        <>
          <circle cx={50} cy={50} r={47} fill="none" stroke="var(--metal)" strokeWidth={2} />
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const x = 50 + 47 * Math.cos(a);
            const y = 50 + 47 * Math.sin(a);
            return <circle key={i} cx={x} cy={y} r={3} fill="var(--diamond)" opacity={0.9} />;
          })}
        </>
      )}
    </svg>
  );
}
