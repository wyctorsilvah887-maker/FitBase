"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth, useUser } from "@/firebase";
import { LpThemeToggle } from "@/components/landing/LpThemeToggle";
import { startTour } from "@/components/tour/Tour";
import { useDismiss } from "./useDismiss";
import "@/components/landing/landing.css";
import "./app.css";

const NAV = [
  { key: "members", href: "/members", label: "Alunos" },
  { key: "dashboard", href: "/dashboard", label: "Painel" },
] as const;

export function AppHeader({ active }: { active: "members" | "dashboard" }) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useDismiss(wrap, open, () => setOpen(false));

  const email = user?.email || "";
  const initial = (email[0] || "?").toUpperCase();

  const handleSignOut = async () => {
    setLeaving(true);
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
      setLeaving(false);
    }
  };

  return (
    <header className="ap-header">
      <div className="ap-header-in">
        <Link href="/members" className="lp-logo-link" aria-label="FitBase, lista de alunos">
          <span className="lp-logo ap-logo" role="img" aria-label="FitBase" />
        </Link>

        <nav className="ap-nav" aria-label="Principal" data-tour="nav">
          {NAV.map((n) => (
            <Link key={n.key} href={n.href} aria-current={active === n.key ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ap-header-right" data-tour="account">
          <button type="button" className="ap-tour-btn" onClick={startTour} aria-label="Como funciona: tour desta tela">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1.1.9-1.1 1.7M12 16.6v.1" />
            </svg>
            <span>Como funciona</span>
          </button>
          <LpThemeToggle />
          <div className="ap-menu-wrap" ref={wrap}>
            <button
              type="button"
              className="ap-avatar-btn"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="Minha conta"
              onClick={() => setOpen((v) => !v)}
            >
              {initial}
            </button>
            {open && (
              <div className="ap-menu ap-menu--account" role="menu">
                <div className="ap-menu-who">
                  <small>Conectado como</small>
                  <strong title={email}>{email || "Minha conta"}</strong>
                </div>
                <Link href="/dashboard" role="menuitem" className="ap-menu-item" onClick={() => setOpen(false)}>
                  Painel de gestão
                </Link>
                <button type="button" role="menuitem" className="ap-menu-item ap-menu-item--bad" onClick={handleSignOut} disabled={leaving}>
                  {leaving ? "Saindo" : "Sair"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
