import { MountKey, MountPoint } from "./types";

export const MOUNTS: Record<MountKey, MountPoint> = {
  center: { x: 50, y: 24.6 },
  accentL1: { x: 33, y: 47 },
  accentL2: { x: 21, y: 58 },
  accentR1: { x: 67, y: 47 },
  accentR2: { x: 79, y: 58 },
};

export const ACCENT_MOUNT_KEYS: MountKey[] = [
  "accentL1",
  "accentL2",
  "accentR1",
  "accentR2",
];

/** Nearest empty accent mount to a given (x,y) percent position, within a snap threshold. */
export function nearestEmptyAccentMount(
  xPct: number,
  yPct: number,
  occupied: Partial<Record<MountKey, unknown>>,
  threshold = 22
): MountKey | null {
  let best: MountKey | null = null;
  let bestDist = Infinity;

  for (const key of ACCENT_MOUNT_KEYS) {
    if (occupied[key]) continue;
    const pos = MOUNTS[key];
    const d = Math.hypot(pos.x - xPct, pos.y - yPct);
    if (d < bestDist) {
      bestDist = d;
      best = key;
    }
  }
  return bestDist < threshold ? best : null;
}
