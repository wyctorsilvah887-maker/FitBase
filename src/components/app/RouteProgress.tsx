"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import "./loading.css";

type State = "idle" | "running" | "done";

/**
 * Barra fina no topo que acompanha a troca de página. Começa ao clicar num link interno
 * e termina quando o endereço muda. O Next não expõe esse evento, então ouvimos os cliques.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<State>("idle");
  const [width, setWidth] = useState(0);
  const timers = useRef<{ trickle?: number; safety?: number; reset?: number }>({});

  const clearAll = () => {
    window.clearInterval(timers.current.trickle);
    window.clearTimeout(timers.current.safety);
    window.clearTimeout(timers.current.reset);
  };

  const finish = () => {
    clearAll();
    setWidth(100);
    setState("done");
    timers.current.reset = window.setTimeout(() => {
      setState("idle");
      setWidth(0);
    }, 650);
  };

  const start = () => {
    clearAll();
    setState("running");
    setWidth(12);
    // avança devagar e nunca chega ao fim sozinha
    timers.current.trickle = window.setInterval(() => {
      setWidth((w) => (w < 85 ? w + (90 - w) * 0.12 : w));
    }, 350);
    // se a navegação não acontecer (link bloqueado, erro), não deixa a barra presa
    timers.current.safety = window.setTimeout(finish, 10000);
  };

  // termina quando a rota muda
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // começa ao clicar num link interno que leva a outra página
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      start();
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="fb-progress" data-state={state} style={{ width: `${width}%` }} aria-hidden="true" />;
}
