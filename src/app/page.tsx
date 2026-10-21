
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
      <div className="animate-bounce">
        <Dumbbell className="w-20 h-20 text-primary" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">
        Carregando <span className="text-primary italic">FitBase...</span>
      </p>
    </div>
  );
}
