/** Dados fictícios, usados só enquanto o tour está aberto e a conta ainda não tem dados. */

const day = (n: number) => new Date(Date.now() + n * 86400000).toISOString();

export function demoMembers() {
  return [
    { id: "demo-1", name: "Marcos Silva", phone: "(85) 99999-1111", plan: "mensal", status: "ativo", joinedAt: day(-20), expiryDate: day(10) },
    { id: "demo-2", name: "Carla Dias", phone: "(85) 98888-2222", plan: "trimestral", status: "ativo", joinedAt: day(-95), expiryDate: day(-4) },
    { id: "demo-3", name: "Rafael Lima", phone: "(85) 97777-3333", plan: "mensal", status: "ativo", joinedAt: day(-28), expiryDate: day(2) },
    { id: "demo-4", name: "Bruna Moura", phone: "(85) 96666-4444", plan: "anual", status: "ativo", joinedAt: day(-100), expiryDate: day(265) },
  ];
}

export const DEMO_MONTH = { total: 8640, weeks: [1480, 2210, 2050, 2900], active: 62, overdue: 7 };

export function demoPayments() {
  const mk = (id: string, memberName: string, amount: number, ago: number, status = "pago") => ({
    id,
    memberName,
    amount,
    status,
    dueDate: day(-ago),
    paidAt: day(-ago),
  });
  return [
    mk("dp-1", "Carla Dias", 120, 1),
    mk("dp-2", "Marcos Silva", 120, 3),
    mk("dp-3", "Bruna Moura", 1100, 6),
    mk("dp-4", "Rafael Lima", 120, 9, "pendente"),
    mk("dp-5", "Júlia Alves", 330, 12),
  ];
}
