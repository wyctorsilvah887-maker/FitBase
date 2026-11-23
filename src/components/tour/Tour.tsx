"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./tour.css";

export type TourStep = {
  /** Seletor CSS do elemento destacado. Sem seletor, o passo vira um aviso no centro da tela. */
  target?: string;
  title: string;
  body: string;
};

export const TOUR_EVENT = "fitbase:tour";

/** Abre o tour da tela atual (o botão "Como funciona" do cabeçalho chama isto). */
export function startTour() {
  window.dispatchEvent(new CustomEvent(TOUR_EVENT));
}

const PAD = 8;
const RADIUS = 14;
const MARGIN = 12;
const GAP = 16;

type Box = { x: number; y: number; w: number; h: number };

function isVisible(el: Element | null): el is HTMLElement {
  if (!el) return false;
  const r = (el as HTMLElement).getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

function holePath(vw: number, vh: number, b: Box) {
  const r = Math.max(0, Math.min(RADIUS, b.w / 2, b.h / 2));
  const { x, y, w, h } = b;
  return (
    `path(evenodd, "M0 0H${vw}V${vh}H0Z ` +
    `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}` +
    `H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z")`
  );
}

export function Tour({ steps }: { steps: TourStep[] }) {
  const [active, setActive] = useState<TourStep[] | null>(null);
  const [index, setIndex] = useState(0);

  const overlay = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const shield = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const cur = useRef<Box | null>(null);
  const reduced = useRef(false);

  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  const close = useCallback(() => {
    setActive(null);
    cur.current = null;
    opener.current?.focus?.({ preventScroll: true });
  }, []);

  // Abre pelo evento. Passos cujo elemento não está na tela (lista vazia, por exemplo) são pulados.
  useEffect(() => {
    const open = () => {
      opener.current = document.activeElement as HTMLElement | null;
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const usable = stepsRef.current.filter((s) => !s.target || isVisible(document.querySelector(s.target)));
      if (usable.length === 0) return;
      cur.current = null;
      setIndex(0);
      setActive(usable);
    };
    window.addEventListener(TOUR_EVENT, open);
    return () => window.removeEventListener(TOUR_EVENT, open);
  }, []);

  const step = active ? active[index] : null;
  const last = active ? index === active.length - 1 : false;

  const go = useCallback(
    (d: number) => {
      if (!active) return;
      const n = index + d;
      if (n < 0) return;
      if (n >= active.length) return close();
      setIndex(n);
    },
    [active, index, close]
  );

  // Ao trocar de passo: leva o elemento para uma área livre da tela e põe o foco no botão.
  useEffect(() => {
    if (!step) return;
    nextBtn.current?.focus({ preventScroll: true });
    if (!step.target) return;
    const el = document.querySelector(step.target);
    if (!isVisible(el)) return;
    const id = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const mobile = window.innerWidth < 640;
      const tipH = tip.current?.offsetHeight ?? 220;
      const top = 76;
      const bottom = vh - (mobile ? tipH + GAP + 12 : 24);
      const room = bottom - top;
      const want = r.height >= room ? top : top + (room - r.height) / 2;
      const dy = r.top - want;
      if (Math.abs(dy) > 4) window.scrollBy({ top: dy, behavior: reduced.current ? "auto" : "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [step, index]);

  // Teclado: setas, Esc e Tab preso dentro do balão.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Tab" && tip.current) {
        const f = Array.from(tip.current.querySelectorAll<HTMLElement>("button:not([disabled])"));
        if (!f.length) return;
        const first = f[0];
        const lastEl = f[f.length - 1];
        const a = document.activeElement;
        if (e.shiftKey && (a === first || !tip.current.contains(a))) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && (a === lastEl || !tip.current.contains(a))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go, close]);

  // Acompanha o elemento a cada quadro: cobre rolagem, redimensionamento e animações da página.
  useEffect(() => {
    if (!step) return;
    let raf = 0;
    const frame = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const el = step.target ? document.querySelector(step.target) : null;
      let goal: Box;
      if (isVisible(el)) {
        const r = el.getBoundingClientRect();
        goal = { x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 };
      } else {
        goal = { x: vw / 2, y: vh / 2, w: 0, h: 0 };
      }
      const c = cur.current;
      if (!c || reduced.current) cur.current = { ...goal };
      else {
        const k = 0.22;
        c.x += (goal.x - c.x) * k;
        c.y += (goal.y - c.y) * k;
        c.w += (goal.w - c.w) * k;
        c.h += (goal.h - c.h) * k;
      }
      const b = cur.current!;
      const hasTarget = goal.w > 0;

      if (overlay.current) overlay.current.style.clipPath = holePath(vw, vh, b);
      if (ring.current) {
        const s = ring.current.style;
        s.opacity = hasTarget ? "1" : "0";
        s.transform = `translate(${b.x}px, ${b.y}px)`;
        s.width = `${b.w}px`;
        s.height = `${b.h}px`;
      }
      if (shield.current) {
        const s = shield.current.style;
        s.display = hasTarget ? "block" : "none";
        s.transform = `translate(${b.x}px, ${b.y}px)`;
        s.width = `${b.w}px`;
        s.height = `${b.h}px`;
      }

      const t = tip.current;
      if (t) {
        const tw = t.offsetWidth;
        const th = t.offsetHeight;
        const mobile = vw < 640;
        let left: number;
        let top: number;
        let side: "top" | "bottom" | "none" = "none";
        if (!hasTarget) {
          left = (vw - tw) / 2;
          top = (vh - th) / 2;
        } else if (mobile) {
          left = (vw - tw) / 2;
          top = vh - th - MARGIN;
        } else {
          const below = vh - (b.y + b.h) - GAP;
          const above = b.y - GAP;
          const cx = b.x + b.w / 2;
          left = Math.min(Math.max(cx - tw / 2, MARGIN), vw - tw - MARGIN);
          if (below >= th) {
            top = b.y + b.h + GAP;
            side = "top";
          } else if (above >= th) {
            top = b.y - GAP - th;
            side = "bottom";
          } else if (vw - (b.x + b.w) - GAP >= tw) {
            left = b.x + b.w + GAP;
            top = Math.min(Math.max(b.y, MARGIN), vh - th - MARGIN);
          } else if (b.x - GAP >= tw) {
            left = b.x - GAP - tw;
            top = Math.min(Math.max(b.y, MARGIN), vh - th - MARGIN);
          } else {
            top = vh - th - MARGIN;
          }
        }
        t.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
        t.dataset.side = side;
        if (side !== "none") {
          const ax = Math.min(Math.max(b.x + b.w / 2 - left, 22), tw - 22);
          t.style.setProperty("--tour-ax", `${ax}px`);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  if (!active || !step) return null;

  return (
    <div className="tour-root">
      <div className="tour-overlay" ref={overlay} aria-hidden="true" />
      <div className="tour-shield" ref={shield} aria-hidden="true" />
      <div className="tour-ring" ref={ring} aria-hidden="true" />

      <div
        className="tour-tip"
        ref={tip}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-body"
      >
        <span className="tour-arrow" aria-hidden="true" />
        <button type="button" className="tour-x" onClick={close} aria-label="Fechar o tour">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <p className="tour-count" aria-live="polite">
          Passo {index + 1} de {active.length}
        </p>
        <h2 className="tour-title" id="tour-title">
          {step.title}
        </h2>
        <p className="tour-body" id="tour-body">
          {step.body}
        </p>
        <div className="tour-foot">
          <span className="tour-dots" aria-hidden="true">
            {active.map((_, i) => (
              <i key={i} className={i === index ? "is-on" : i < index ? "is-done" : ""} />
            ))}
          </span>
          <span className="tour-actions">
            {index > 0 && (
              <button type="button" className="tour-btn tour-btn--ghost" onClick={() => go(-1)}>
                Voltar
              </button>
            )}
            <button type="button" className="tour-btn tour-btn--primary" ref={nextBtn} onClick={() => go(1)}>
              {index === 0 ? "Começar" : last ? "Concluir" : "Próximo"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
