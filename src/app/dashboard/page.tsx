"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, doc, serverTimestamp } from "firebase/firestore";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/app/AppHeader";
import { LoadingScreen } from "@/components/app/LoadingScreen";
import { Tour, type TourStep } from "@/components/tour/Tour";
import { MonthSummary } from "@/components/landing/MonthSummary";
import { getEffectiveStatus } from "@/lib/member-utils";
import { monthRevenue } from "@/lib/dashboard-stats";
import { formatBRL, initialsOf } from "@/lib/format";
import "@/components/landing/landing.css";
import "@/components/app/app.css";

const maskMoney = (value: string) => {
  const cents = parseInt(value.replace(/\D/g, "") || "0", 10) / 100;
  return cents.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const TOUR: TourStep[] = [
  {
    title: "O mês numa tela",
    body: "O Painel junta o que entrou no caixa e a situação dos alunos, sem somar nada à mão. Vamos ver cada parte.",
  },
  {
    target: ".ap-dash-month .lp-month-total",
    title: "Quanto entrou no caixa",
    body: "Soma todos os pagamentos registrados neste mês. Ele atualiza sozinho a cada pagamento novo.",
  },
  {
    target: ".ap-dash-month .lp-month-chips",
    title: "Em dia e vencidos",
    body: "Quantos alunos estão com o plano em dia e quantos venceram. Quem venceu aparece na lista de Alunos, pronto para cobrar.",
  },
  {
    target: ".ap-dash-month .lp-bars",
    title: "Receita por semana",
    body: "Cada barra é uma semana do mês. A mais alta é a semana em que mais dinheiro entrou.",
  },
  {
    target: '[data-tour="fee"]',
    title: "Defina a mensalidade",
    body: "Esse valor é usado ao registrar pagamentos e novos alunos. Se mudar o preço, salve aqui.",
  },
  {
    target: '[data-tour="payments"]',
    title: "Últimos pagamentos",
    body: "Os pagamentos mais recentes, com a data e o valor. Use Ver todos para abrir a lista completa.",
  },
  {
    target: '[data-tour="nav"]',
    title: "Volte para os alunos",
    body: "Pelo menu você troca entre o Painel e a lista de Alunos. O botão Como funciona repete este tour.",
  },
];

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [fee, setFee] = useState("0,00");
  const [saved, setSaved] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) router.push("/login");
  }, [user, isUserLoading, router]);

  const membersQuery = useMemoFirebase(
    () => (user && db ? collection(db, "users", user.uid, "members") : null),
    [user, db]
  );
  const paymentsQuery = useMemoFirebase(
    () => (user && db ? query(collection(db, "users", user.uid, "payments"), orderBy("dueDate", "desc")) : null),
    [user, db]
  );
  const userRef = useMemoFirebase(() => (user && db ? doc(db, "users", user.uid) : null), [user, db]);

  const { data: members } = useCollection(membersQuery);
  const { data: payments } = useCollection(paymentsQuery);
  const { data: userDoc } = useDoc(userRef);

  useEffect(() => {
    if (userDoc?.monthlyFee !== undefined) {
      setFee(Number(userDoc.monthlyFee).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [userDoc]);

  const month = useMemo(() => monthRevenue(payments), [payments]);
  const active = useMemo(() => (members ?? []).filter((m) => getEffectiveStatus(m) === "ativo").length, [members]);
  const overdue = useMemo(() => (members ?? []).filter((m) => getEffectiveStatus(m) === "vencido").length, [members]);

  const feeValue = parseFloat(fee.replace(/\./g, "").replace(",", ".")) || 0;
  const feeChanged = feeValue !== Number(userDoc?.monthlyFee ?? 0);

  const save = () => {
    if (!userRef || !feeChanged) return;
    setDocumentNonBlocking(userRef, { monthlyFee: feeValue, updatedAt: serverTimestamp() }, { merge: true });
    toast({ title: "Mensalidade salva", description: `Novo valor: ${formatBRL(feeValue)}.` });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  if (!mounted || isUserLoading) return <LoadingScreen message="Abrindo o painel" />;

  const list = showAll ? payments ?? [] : (payments ?? []).slice(0, 6);

  return (
    <div className="lp">
      <AppHeader active="dashboard" />

      <main className="ap-main">
        <div className="ap-head">
          <div>
            <h1 className="ap-title">Painel</h1>
            <p className="ap-sub">O mês inteiro numa tela.</p>
          </div>
          <Link href="/members" className="lp-btn lp-btn-ghost">Ver alunos</Link>
        </div>

        <section className="lp-card ap-dash-month" aria-label="Resumo do mês">
          <MonthSummary total={month.total} weeks={month.weeks} active={active} overdue={overdue} />
        </section>

        <div className="ap-dash-grid">
          <section className="lp-card" aria-labelledby="dash-fee" data-tour="fee">
            <h2 className="ap-dash-h" id="dash-fee">Valor da mensalidade</h2>
            <p className="ap-dash-note">Usado ao registrar renovações e novos alunos.</p>
            <label className="ap-label" htmlFor="fee">Mensalidade (R$)</label>
            <input
              id="fee"
              className="ap-input"
              inputMode="numeric"
              value={fee}
              onChange={(e) => setFee(maskMoney(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && save()}
            />
            <button type="button" className="lp-btn lp-btn-primary ap-dash-save" onClick={save} disabled={!feeChanged && !saved}>
              {saved ? "Salvo" : "Salvar valor"}
            </button>
          </section>

          <section className="lp-card" aria-labelledby="dash-pay" data-tour="payments">
            <h2 className="ap-dash-h" id="dash-pay">Últimos pagamentos</h2>
            {list.length === 0 ? (
              <p className="ap-dash-note">Nenhum pagamento ainda. Registre o primeiro pelo cartão do aluno.</p>
            ) : (
              <ul className="ap-pay-list">
                {list.map((p) => {
                  const when = new Date(p.paidAt || p.dueDate);
                  const paid = p.status === "pago";
                  return (
                    <li key={p.id}>
                      <span className="ap-avatar" aria-hidden="true">{initialsOf(p.memberName || "")}</span>
                      <span className="ap-pay-who">
                        <strong>{p.memberName || "Aluno"}</strong>
                        <small>{isNaN(when.getTime()) ? "" : when.toLocaleDateString("pt-BR")}</small>
                      </span>
                      <span className="ap-pay-val">
                        {formatBRL(Number(p.amount) || 0)}
                        <span className={`lp-chip ${paid ? "lp-chip--ok" : "lp-chip--warn"}`}>{paid ? "Pago" : "Pendente"}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            {(payments?.length ?? 0) > 6 && (
              <button type="button" className="lp-link-btn" onClick={() => setShowAll((v) => !v)}>
                {showAll ? "Mostrar menos" : "Ver todos"}
              </button>
            )}
          </section>
        </div>
      </main>
      <Tour steps={TOUR} />
    </div>
  );
}
