"use client";

import { useEffect } from "react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { Dumbbell } from "lucide-react";
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

  if (isUserLoading || user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="animate-spin">
          <Dumbbell className="w-16 h-16 text-primary" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">
          Sincronizando <span className="text-primary italic">FitBase...</span>
        </p>
      </div>
    );
  }

  return (
    <div className="lp">
      <LandingNav />
      <LandingContent />
    </div>
  );
}
