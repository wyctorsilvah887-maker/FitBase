"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Dumbbell className="w-12 h-12 animate-bounce text-primary" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">
        Carregando <span className="text-primary italic">FitFlow...</span>
      </p>
    </div>
  );
}
