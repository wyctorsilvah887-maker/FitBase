"use client";

import { useState } from "react";
import { ShieldCheck, PawPrint, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisModal } from "@/components/AnalysisModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-body overflow-x-hidden">
      <div className="bg-noise" />
      
      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-10 flex justify-center">
        <div className="flex items-center gap-2 group cursor-default">
          <PawPrint className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-headline font-bold tracking-tighter">
            Vet <span className="text-primary italic">IA</span>
          </h1>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-16 md:pt-28 pb-24 space-y-24 md:space-y-36">
        {/* Hero Section */}
        <section className="text-center space-y-10 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black tracking-[0.3em] text-primary uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            IA Preventiva de Saúde
          </div>
          
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-4xl md:text-7xl font-headline font-bold tracking-tight leading-[1.05]">
              Cuidando do seu <span className="text-primary italic">pet</span><br className="hidden md:block" /> com inteligência
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium px-4">
              Análise inteligente de sintomas e nutrição animal. O bem-estar do seu amigo começa com a prevenção avançada da WS Studios.
            </p>
          </div>

          <div className="flex justify-center pt-6 px-4">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto rounded-full px-14 h-16 text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-primary/20 bg-primary text-black hover:bg-primary/90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Iniciar Análise IA
            </Button>
          </div>
        </section>

        {/* WS Studios Card */}
        <section className="pt-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-primary/10 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <Card className="relative bg-zinc-950/50 border-zinc-900 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
              <CardContent className="p-12 md:p-20 flex flex-col items-center text-center space-y-8 md:space-y-10">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-headline font-black tracking-tight uppercase">Tecnologia WS Studios</h3>
                  <p className="text-zinc-500 text-sm md:text-base max-w-md leading-relaxed font-medium">
                    Nossa missão é antecipar problemas e educar tutores. Lembre-se: o Vet IA orienta, mas não substitui a consulta profissional.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-20 text-center text-[10px] font-black text-zinc-800 uppercase tracking-[0.6em] relative z-10">
        © {new Date().getFullYear()} Vet IA • Powered by WS Studios
      </footer>

      <AnalysisModal 
        type="text"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}