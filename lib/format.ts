export const fmtCount = (n: number) => (n >= 10000 ? `${(n / 10000).toFixed(1)}万` : String(n));
