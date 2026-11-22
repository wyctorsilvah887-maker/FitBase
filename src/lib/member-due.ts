import { differenceInCalendarDays, format } from "date-fns";

export type DueTone = "ok" | "warn" | "bad" | "muted";

/**
 * Texto de vencimento para a lista de alunos, em dias de calendário.
 * `status` é o status efetivo (já derivado da data de vencimento).
 */
export function describeDue(
  expiryDate: string | null | undefined,
  status: "ativo" | "vencido" | string,
  now: Date = new Date()
): { tone: DueTone; text: string } {
  if (!expiryDate) return { tone: "muted", text: "Sem vencimento" };
  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) return { tone: "muted", text: "Sem vencimento" };

  const d = differenceInCalendarDays(expiry, now);

  if (status === "vencido") {
    if (d > 0) return { tone: "bad", text: "Marcado como vencido" };
    if (d === 0) return { tone: "bad", text: "Venceu hoje" };
    if (d === -1) return { tone: "bad", text: "Venceu ontem" };
    return { tone: "bad", text: `Venceu há ${-d} dias` };
  }

  if (d === 0) return { tone: "warn", text: "Vence hoje" };
  if (d === 1) return { tone: "warn", text: "Vence amanhã" };
  if (d <= 5) return { tone: "warn", text: `Vence em ${d} dias` };
  return { tone: "ok", text: `Em dia até ${format(expiry, "dd/MM/yyyy")}` };
}
