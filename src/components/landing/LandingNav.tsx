"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LpThemeToggle } from "@/components/landing/LpThemeToggle";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`lp-nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="lp-wrap lp-nav-inner">
        <Link href="/" className="lp-logo-link" aria-label="FitBase, página inicial">
          <span className="lp-logo" role="img" aria-label="FitBase" />
        </Link>

        <nav className="lp-nav-links" aria-label="Principal">
          <a href="#recursos">Como funciona</a>
        </nav>

        <div className="lp-nav-actions">
          <LpThemeToggle />
          <Link href="/login" className="lp-btn lp-btn-ghost lp-btn-sm">
            Entrar
          </Link>
          <Link href="/register" className="lp-btn lp-btn-primary lp-btn-sm">
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  );
}
