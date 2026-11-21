"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, usePrefersReducedMotion } from "./useInView";

/* ------------------------------------------------------------------ */
/* Busca de alunos                                                      */
/* ------------------------------------------------------------------ */

const NAMES: { name: string; plan: string; initials: string }[] = [
  { name: "Marcos Silva", plan: "Mensal", initials: "MS" },
  { name: "Mariana Costa", plan: "Trimestral", initials: "MC" },
  { name: "Júlia Alves", plan: "Mensal", initials: "JA" },
  { name: "Rafael Lima", plan: "Trimestral", initials: "RL" },
  { name: "Carla Dias", plan: "Mensal", initials: "CD" },
  { name: "Bruna Moura", plan: "Anual", initials: "BM" },
  { name: "Marta Nunes", plan: "Mensal", initials: "MN" },
  { name: "Marcelo Prado", plan: "Anual", initials: "MP" },
];

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function SearchDemo() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [q, setQ] = useState("");
  const touched = useRef(false);

  // Digita "mar" sozinho uma vez, até a pessoa assumir o teclado.
  useEffect(() => {
    if (!inView || touched.current) return;
    const target = "mar";
    if (reduced) {
      setQ(target);
      return;
    }
    let i = 0;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        if (touched.current) {
          window.clearInterval(interval);
          return;
        }
        i += 1;
        setQ(target.slice(0, i));
        if (i >= target.length) window.clearInterval(interval);
      }, 380);
    }, 500);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [inView, reduced]);

  const matches = NAMES.filter((n) => normalize(n.name).includes(normalize(q.trim())));
  // Mostra no máximo 4 linhas para a altura do cartão não pular enquanto digita.
  const results = matches.slice(0, 4);

  return (
    <div className="lp-mini" ref={ref}>
      <label className="lp-field">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          value={q}
          placeholder="Buscar aluno"
          aria-label="Buscar aluno (exemplo)"
          onFocus={() => (touched.current = true)}
          onChange={(e) => {
            touched.current = true;
            setQ(e.target.value);
          }}
        />
        <span className="lp-count">
          {matches.length} de {NAMES.length}
        </span>
      </label>

      <ul className="lp-results" aria-live="polite">
        {results.map((r) => (
          <li key={r.name} className="lp-result">
            <span className="lp-avatar">{r.initials}</span>
            <span className="lp-app-who">
              <strong>{r.name}</strong>
              <small>{r.plan}</small>
            </span>
          </li>
        ))}
        {results.length === 0 && (
          <li className="lp-empty">
            Nenhum aluno com esse nome. Confira a grafia ou cadastre um novo aluno.
          </li>
        )}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pagamento                                                            */
/* ------------------------------------------------------------------ */

function PaymentDemo() {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);
  const reduced = usePrefersReducedMotion();
  const [method, setMethod] = useState<null | "Pix" | "Dinheiro">(null);
  const touched = useRef(false);

  // Mostra o fluxo uma vez, sozinho, quando o cartão aparece.
  useEffect(() => {
    if (!inView || reduced || touched.current) return;
    const t = window.setTimeout(() => {
      if (!touched.current) setMethod("Pix");
    }, 1400);
    return () => window.clearTimeout(t);
  }, [inView, reduced]);

  const paid = method !== null;

  const pay = (m: "Pix" | "Dinheiro") => {
    touched.current = true;
    setMethod(m);
  };

  return (
    <div className="lp-mini lp-pay" ref={ref}>
      <div className="lp-pay-row">
        <span className="lp-avatar">CD</span>
        <span className="lp-app-who">
          <strong>Carla Dias</strong>
          <small>{paid ? "Mensal · vence em 21/12" : "Mensal · venceu há 4 dias"}</small>
        </span>
        <span key={paid ? "ok" : "bad"} className={`lp-chip lp-chip--${paid ? "ok" : "bad"} lp-swap`}>
          {paid ? "Ativo" : "Vencido"}
        </span>
      </div>

      <div className="lp-pay-total">
        <span>Valor</span>
        {paid &&<span className="lp-stamp" aria-hidden="true">Pago</span>}
        <strong>R$ 120,00</strong>
      </div>

      <div className="lp-pay-actions">
        {(["Pix", "Dinheiro"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={`lp-pay-btn${method === m ? " is-picked" : ""}`}
            disabled={paid}
            onClick={() => pay(m)}
          >
            {method === m ? `${m} ✓` : m}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="lp-link-btn lp-redo"
        data-visible={paid}
        tabIndex={paid ? 0 : -1}
        onClick={() => {
          touched.current = true;
          setMethod(null);
        }}
      >
        Refazer o exemplo
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Resumo do mês                                                        */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, run: boolean, reduced: boolean, ms = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, reduced, ms]);
  return value;
}

const WEEKS = [1480, 2210, 2050, 2900];
const MAX_WEEK = Math.max(...WEEKS);

function MonthDemo() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const total = useCountUp(8640, inView, reduced);

  return (
    <div className={`lp-month${inView ? " is-in" : ""}`} ref={ref}>
      <div className="lp-month-top">
        <div>
          <span className="lp-month-label">Entrou no caixa este mês</span>
          <strong className="lp-month-total">R$ {total.toLocaleString("pt-BR")}</strong>
        </div>
        <div className="lp-month-chips">
          <span className="lp-chip lp-chip--ok">62 em dia</span>
          <span className="lp-chip lp-chip--bad">7 vencidos</span>
        </div>
      </div>

      <div className="lp-bars" role="img" aria-label="Receita por semana: 1.480, 2.210, 2.050 e 2.900 reais">
        {WEEKS.map((v, i) => (
          <div className="lp-bar-col" key={i}>
            <div className="lp-bar-track">
              <div
                className="lp-bar"
                style={{ height: `${(v / MAX_WEEK) * 100}%`, transitionDelay: `${i * 120}ms` }}
              />
            </div>
            <span>Semana {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Seção                                                                */
/* ------------------------------------------------------------------ */

export function Features() {
  return (
    <section className="lp-section" id="recursos">
      <div className="lp-wrap">
        <div className="lp-section-head">
          <h2 className="lp-h2">O que muda na rotina da recepção</h2>
          <p className="lp-lead">
            Três tarefas que hoje tomam tempo no caderno, feitas em poucos toques. Os exemplos abaixo
            funcionam: experimente.
          </p>
        </div>

        <div className="lp-grid">
          <article className="lp-card lp-card--a">
            <h3 className="lp-h3">Encontre qualquer aluno pelo nome</h3>
            <p className="lp-card-text">Sem virar página. A lista filtra a cada letra que você digita.</p>
            <SearchDemo />
          </article>

          <article className="lp-card lp-card--b">
            <h3 className="lp-h3">Registre o pagamento em um toque</h3>
            <p className="lp-card-text">
              Pix ou dinheiro. O plano renova e o novo vencimento é calculado para você.
            </p>
            <PaymentDemo />
          </article>

          <article className="lp-card lp-card--c">
            <div className="lp-card-c-text">
              <h3 className="lp-h3">Veja o mês inteiro numa tela</h3>
              <p className="lp-card-text">
                Quantos alunos estão em dia, quantos venceram e quanto entrou no caixa, sem somar nada à mão.
              </p>
              <p className="lp-fine">Valores de exemplo.</p>
            </div>
            <MonthDemo />
          </article>
        </div>
      </div>
    </section>
  );
}
