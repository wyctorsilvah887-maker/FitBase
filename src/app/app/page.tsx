"use client";

import { useEffect } from "react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/app/LoadingScreen";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingContent } from "@/components/landing/LandingContent";
import "@/components/landing/landing.css";

export default function GymLandingPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace("/members");
    }
  }, [user, isUserLoading, router]);

  // Visitante: a landing aparece assim que o login for checado. Já logado: segue para os alunos.
  if (isUserLoading || user) {
    return <LoadingScreen message={user ? "Abrindo seus alunos" : "Verificando seu acesso"} />;
  }

  return (
    <div className="lp">
      <LandingNav />
      <LandingContent />
    </div>
  );
}
