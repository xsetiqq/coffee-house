export function toCents(v: string | number | null | undefined): number {
  const n = typeof v === "number" ? v : Number(v ?? "0");
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}
export function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
