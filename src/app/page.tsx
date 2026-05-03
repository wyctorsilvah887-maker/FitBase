"use client";

import { useState } from "react";
import { ShieldCheck, PawPrint, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisModal } from "@/components/AnalysisModal";
import { AnalysisEntry } from "@/app/lib/history-store";

export default function Home() {
  const [modalType, setModalType] = useState<'text' | 'image' | null>(null);

  const openModal = (type: 'text' | 'image') => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-body overflow-x-hidden">
      <div className="fixed inset-0 bg-noise pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-center">
        <div className="flex items-center gap-2 group cursor-default">
          <PawPrint className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-headline font-bold tracking-tighter">
            Vet <span className="text-primary italic">IA</span>
          </h1>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12 md:pt-20 pb-24 space-y-20 md:space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[9px] font-black tracking-[0.3em] text-primary uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            IA Preventiva de Saúde
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight leading-[1.1]">
              Cuidando do seu <span className="text-primary italic">pet</span> com IA
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-xs md:text-sm leading-relaxed font-medium px-4">
              Acompanhamento inteligente de sintomas e nutrição animal. O bem-estar do seu melhor amigo começa com a prevenção da WS Studios.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 px-4 max-w-sm mx-auto sm:max-w-none">
            <Button 
              onClick={() => openModal('text')}
              className="w-full sm:w-auto rounded-full px-8 h-14 text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-lg shadow-primary/10"
            >
              Análise de Texto
            </Button>
            <Button 
              variant="outline"
              onClick={() => openModal('image')}
              className="w-full sm:w-auto rounded-full px-8 h-14 text-[10px] font-black uppercase tracking-[0.2em] border-white/10 hover:bg-primary/10 hover:border-primary transition-all"
            >
              Análise de Imagem
            </Button>
          </div>
        </section>

        {/* WS Studios Card */}
        <section className="pt-4 md:pt-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-primary/20 rounded-[2rem] md:rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <Card className="relative bg-[#050505] border-zinc-900/50 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 md:p-16 flex flex-col items-center text-center space-y-6 md:space-y-8">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Tecnologia WS Studios</h3>
                  <p className="text-zinc-500 text-xs md:text-sm max-w-sm leading-relaxed font-medium">
                    Nossa missão é antecipar problemas e educar tutores. Lembre-se: o Vet IA orienta através de análise de dados, mas não substitui a consulta profissional.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-4 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary/50" /> IA Avançada</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary/50" /> Suporte 24/7</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-16 text-center text-[9px] font-black text-zinc-800 uppercase tracking-[0.5em] relative z-10">
        © {new Date().getFullYear()} Vet IA • Powered by WS Studios
      </footer>

      {/* Modals */}
      <AnalysisModal 
        type={modalType}
        isOpen={!!modalType}
        onClose={closeModal}
        onSuccess={() => {}}
      />
    </div>
  );
}
