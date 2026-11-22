"use client";

import { useEffect, useState } from "react";
import { useInView, usePrefersReducedMotion } from "./useInView";

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

const brl = (n: number) => n.toLocaleString("pt-BR");

/** Resumo do mês: o mesmo componente na landing (valores de exemplo) e no painel (dados reais). */
export function MonthSummary({
  total,
  weeks,
  active,
  overdue,
}: {
  total: number;
  weeks: number[];
  active: number;
  overdue: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const shown = useCountUp(Math.round(total), inView, reduced);
  const max = Math.max(...weeks, 0);

  return (
    <div className={`lp-month${inView ? " is-in" : ""}`} ref={ref}>
      <div className="lp-month-top">
        <div>
          <span className="lp-month-label">Entrou no caixa este mês</span>
          <strong className="lp-month-total">R$ {brl(shown)}</strong>
        </div>
        <div className="lp-month-chips">
          <span className="lp-chip lp-chip--ok">{active} em dia</span>
          <span className="lp-chip lp-chip--bad">{overdue} {overdue === 1 ? "vencido" : "vencidos"}</span>
        </div>
      </div>

      <div
        className="lp-bars"
        role="img"
        aria-label={`Receita por semana: ${weeks.map((w) => `${brl(w)} reais`).join(", ")}`}
      >
        {weeks.map((v, i) => (
          <div className="lp-bar-col" key={i}>
            <div className="lp-bar-track">
              <div
                className="lp-bar"
                style={{ height: `${max > 0 ? Math.max(v > 0 ? 4 : 0, (v / max) * 100) : 0}%`, transitionDelay: `${i * 120}ms` }}
              />
            </div>
            <span>Semana {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
