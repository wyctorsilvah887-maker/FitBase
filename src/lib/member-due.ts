import { differenceInCalendarDays, format } from "date-fns";

export type DueTone = "ok" | "warn" | "bad" | "muted";

export type Due = { tone: DueTone; text: string; short: string };

/**
 * Texto de vencimento para a lista de alunos, em dias de calendário.
 * `status` é o status efetivo (já derivado da data de vencimento).
 */
export function describeDue(
  expiryDate: string | null | undefined,
  status: "ativo" | "vencido" | string,
  now: Date = new Date()
): Due {
  if (!expiryDate) return { tone: "muted", text: "Sem vencimento", short: "sem vencimento" };
  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) return { tone: "muted", text: "Sem vencimento", short: "sem vencimento" };

  const d = differenceInCalendarDays(expiry, now);

  if (status === "vencido") {
    if (d > 0) return { tone: "bad", text: "Marcado como vencido", short: "marcado como vencido" };
    if (d === 0) return { tone: "bad", text: "Venceu hoje", short: "venceu hoje" };
    if (d === -1) return { tone: "bad", text: "Venceu ontem", short: "venceu ontem" };
    return { tone: "bad", text: `Venceu há ${-d} dias`, short: `venceu há ${-d} dias` };
  }

  if (d === 0) return { tone: "warn", text: "Vence hoje", short: "vence hoje" };
  if (d === 1) return { tone: "warn", text: "Vence amanhã", short: "vence amanhã" };
  if (d <= 5) return { tone: "warn", text: `Vence em ${d} dias`, short: `vence em ${d} dias` };
  // Mesmo formato do exemplo da landing ("vence em 21/12"); o ano só aparece se for outro.
  const sameYear = expiry.getFullYear() === now.getFullYear();
  return {
    tone: "ok",
    text: `Em dia até ${format(expiry, "dd/MM/yyyy")}`,
    short: `vence em ${format(expiry, sameYear ? "dd/MM" : "dd/MM/yyyy")}`,
  };
}
