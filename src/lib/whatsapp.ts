import { differenceInCalendarDays, format } from "date-fns";

/** Telefone só com dígitos e com o 55 do Brasil (sem duplicar). */
export function waNumber(phone: string | null | undefined): string {
  const d = (phone || "").replace(/\D/g, "");
  if (!d) return "";
  return d.length > 11 && d.startsWith("55") ? d : `55${d}`;
}

export function waLink(phone: string | null | undefined, text?: string): string {
  const n = waNumber(phone);
  if (!n) return "";
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Mensagem de cobrança (plano vencido) ou lembrete (vence em breve), no tom de uma academia de bairro. */
export function buildDueMessage(
  name: string,
  gymName: string,
  expiryDate: string | null | undefined,
  now: Date = new Date()
): string {
  const first = (name || "").trim().split(/\s+/)[0] || "";
  const hi = first ? `Oi, ${first}!` : "Oi!";
  const gym = gymName ? ` na ${gymName}` : "";
  const expiry = expiryDate ? new Date(expiryDate) : null;
  if (!expiry || isNaN(expiry.getTime())) {
    return `${hi} Passando para falar do seu plano${gym}. Quer renovar?`;
  }
  const d = differenceInCalendarDays(expiry, now);
  const date = format(expiry, "dd/MM");
  if (d < 0) return `${hi} Seu plano${gym} venceu dia ${date}. Quer renovar para não perder o ritmo dos treinos?`;
  if (d === 0) return `${hi} Seu plano${gym} vence hoje. Quer renovar?`;
  return `${hi} Seu plano${gym} vence dia ${date}. Quer renovar antes para não ficar sem treinar?`;
}
