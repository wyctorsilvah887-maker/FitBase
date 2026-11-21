"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { usePrefersReducedMotion } from "./useInView";

/** Posição de repouso do divisor: um pouco mais de caderno do que de app. */
const REST = 46;

type Tone = "ok" | "warn" | "bad";

const STUDENTS: {
  initials: string;
  name: string;
  plan: string;
  tone: Tone;
  status: string;
  amount: string;
}[] = [
  { initials: "MS", name: "Marcos Silva", plan: "Mensal", tone: "ok", status: "Ativo", amount: "R$ 120,00" },
  { initials: "JA", name: "Júlia Alves", plan: "Mensal", tone: "warn", status: "Vence em 3 dias", amount: "R$ 120,00" },
  { initials: "RL", name: "Rafael Lima", plan: "Trimestral", tone: "ok", status: "Ativo", amount: "R$ 360,00" },
  { initials: "CD", name: "Carla Dias", plan: "Mensal", tone: "bad", status: "Vencido", amount: "R$ 120,00" },
  { initials: "BM", name: "Bruna Moura", plan: "Anual", tone: "ok", status: "Ativo", amount: "R$ 1.440,00" },
];

export function HeroCompare() {
  const reduced = usePrefersReducedMotion();
  const [pos, setPos] = useState(100);
  const [settling, setSettling] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  /** Mostra o caderno inteiro e, em seguida, o FitBase "escaneia" por cima. */
  const play = useCallback(() => {
    clearTimers();
    setSettling(false);
    setPos(100);
    timers.current.push(
      window.setTimeout(() => {
        setSettling(true);
        setPos(REST);
      }, 450),
      window.setTimeout(() => setSettling(false), 450 + 1900)
    );
  }, []);

  useEffect(() => {
    if (reduced) {
      clearTimers();
      setSettling(false);
      setPos(REST);
    } else {
      play();
    }
    return clearTimers;
  }, [reduced, play]);

  return (
    <figure className="lp-compare">
      <div
        className={`lp-stage${settling ? " is-settling" : ""}`}
        style={{ "--pos": `${pos}%` } as CSSProperties}
      >
        {/* Caderno */}
        <div className="lp-layer lp-notebook" aria-hidden="true">
          <div className="lp-nb-head">Alunos – março</div>
          <div className="lp-rows">
            <div className="lp-note" style={{ "--tilt": "-0.6deg" } as CSSProperties}>
              <span>Marcos S. – mensal – pagou dia 5 ✓</span>
            </div>
            <div className="lp-note" style={{ "--tilt": "0.5deg" } as CSSProperties}>
              <span>Júlia A. – mensal – vence dia 14?</span>
            </div>
            <div className="lp-note" style={{ "--tilt": "-0.3deg" } as CSSProperties}>
              <span>Rafael L. – trim. – 330 (confirmar)</span>
            </div>
            <div className="lp-note" style={{ "--tilt": "0.7deg" } as CSSProperties}>
              <span>
                Carla D. – <s>trimestral</s> mensal – deve 120
              </span>
            </div>
            <div className="lp-note" style={{ "--tilt": "-0.5deg" } as CSSProperties}>
              <span>Bruna M. – ? – ver a outra folha</span>
            </div>
          </div>
          <div className="lp-smudge" />
          <div className="lp-ring" />
        </div>

        {/* FitBase */}
        <div className="lp-layer lp-app" aria-hidden="true">
          <div className="lp-app-head">
            <span className="lp-app-title">Alunos</span>
            <span className="lp-app-search">Buscar aluno</span>
          </div>
          {STUDENTS.map((s) => (
            <div className="lp-app-row" key={s.name}>
              <span className="lp-avatar">{s.initials}</span>
              <span className="lp-app-who">
                <strong>{s.name}</strong>
                <small>{s.plan}</small>
              </span>
              <span className={`lp-chip lp-chip--${s.tone}`}>{s.status}</span>
              <span className="lp-amount">{s.amount}</span>
            </div>
          ))}
        </div>

        <div className="lp-divider" aria-hidden="true">
          <span className="lp-handle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 7l-5 5 5 5" />
              <path d="M15 7l5 5-5 5" />
            </svg>
          </span>
        </div>

        <input
          className="lp-range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          aria-label="Comparar o caderno e o FitBase"
          aria-valuetext={`${Math.round(pos)}% caderno, ${Math.round(100 - pos)}% FitBase`}
          onChange={(e) => {
            clearTimers();
            setSettling(false);
            setPos(Number(e.target.value));
          }}
        />
      </div>

      <figcaption className="lp-caption">
        <span>Os mesmos cinco alunos, antes e depois. Arraste para comparar.</span>
        <button type="button" className="lp-link-btn" onClick={play}>
          Ver de novo
        </button>
      </figcaption>
    </figure>
  );
}
