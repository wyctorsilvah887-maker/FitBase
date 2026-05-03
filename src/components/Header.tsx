"use client";

import { PawPrint } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative z-10 max-w-7xl mx-auto px-6 py-10 flex justify-center">
      <Link href="/" className="flex items-center gap-2 group cursor-pointer">
        <PawPrint className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-headline font-bold tracking-tighter text-white">
          Vet <span className="text-primary italic">IA</span>
        </h1>
      </Link>
    </header>
  );
}
