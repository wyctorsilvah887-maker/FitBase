export type PaymentLike = {
  status?: string;
  amount?: number | string;
  paidAt?: string;
  dueDate?: string;
};

function toNumber(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
}

/** Semana 1 = dias 1–7, semana 2 = 8–14, semana 3 = 15–21, semana 4 = 22 até o fim do mês. */
export function weekOfMonth(day: number): 0 | 1 | 2 | 3 {
  return Math.min(3, Math.floor((day - 1) / 7)) as 0 | 1 | 2 | 3;
}

/** Soma o que entrou no caixa no mês de `now`, no total e por semana. */
export function monthRevenue(payments: PaymentLike[] | null | undefined, now = new Date()) {
  const weeks = [0, 0, 0, 0];
  let total = 0;
  for (const p of payments ?? []) {
    if (p.status !== "pago") continue;
    const d = new Date(p.paidAt || p.dueDate || "");
    if (isNaN(d.getTime())) continue;
    if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) continue;
    const v = toNumber(p.amount);
    weeks[weekOfMonth(d.getDate())] += v;
    total += v;
  }
  return { total, weeks };
}
