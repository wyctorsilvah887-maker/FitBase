"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/app/LoadingScreen";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app");
  }, [router]);

  return <LoadingScreen message="Abrindo o FitBase" />;
}
