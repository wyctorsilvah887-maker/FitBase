import { addMonths } from 'date-fns';

export type Plan = 'mensal' | 'trimestral' | 'anual';
export type MemberStatus = 'ativo' | 'vencido';

/** Quantidade de meses de cada plano. */
export const PLAN_MONTHS: Record<Plan, number> = {
  mensal: 1,
  trimestral: 3,
  anual: 12,
};

export function getPlanMonths(plan?: string): number {
  return PLAN_MONTHS[plan as Plan] ?? 1;
}

/**
 * Preço do plano: valor da mensalidade multiplicado pelos meses do plano,
 * arredondado para centavos. (Ex.: mensalidade 100 -> trimestral 300, anual 1200.)
 */
export function getPlanPrice(plan: string | undefined, monthlyFee: number): number {
  const fee = Number.isFinite(monthlyFee) ? monthlyFee : 0;
  return Math.round(fee * getPlanMonths(plan) * 100) / 100;
}

/**
 * Soma o período do plano a uma data. Usa addMonths do date-fns, que respeita
 * o fim do mês (31/jan + 1 mês = 28/fev, e não 3/mar como o setMonth nativo).
 */
export function addPlanPeriod(base: Date, plan: string | undefined): Date {
  return addMonths(base, getPlanMonths(plan));
}

/**
 * Status real do aluno. O campo `status` gravado só diz "ativo" no momento da
 * matrícula/renovação; o que manda é a data de vencimento. Um aluno marcado
 * manualmente como "vencido" continua vencido até ser renovado.
 */
export function getEffectiveStatus(
  member: { status?: string; expiryDate?: string | null },
  now: Date = new Date()
): MemberStatus {
  if (member.status === 'vencido') return 'vencido';
  if (member.expiryDate) {
    const expiry = new Date(member.expiryDate);
    if (!isNaN(expiry.getTime()) && expiry.getTime() < now.getTime()) return 'vencido';
  }
  return 'ativo';
}

/**
 * Calcula as novas datas de uma renovação.
 * - Plano já vencido: o novo período começa agora.
 * - Plano ainda ativo: o novo período começa quando o atual terminar.
 */
export function getRenewalDates(
  member: { expiryDate?: string | null; plan?: string },
  now: Date = new Date()
): { joinedAt: Date; expiry: Date } {
  let base = member.expiryDate ? new Date(member.expiryDate) : now;
  if (isNaN(base.getTime()) || base < now) base = now;
  return { joinedAt: base, expiry: addPlanPeriod(base, member.plan) };
}
