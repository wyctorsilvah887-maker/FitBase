
"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Sparkles, AlertCircle, ClipboardList, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisModal } from "@/components/AnalysisModal";
import { CareGuideModal } from "@/components/CareGuideModal";
import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isCareGuideModalOpen, setIsCareGuideModalOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-body overflow-x-hidden">
      <div className="bg-noise" />
      
      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-24 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-10 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[7px] font-black tracking-[0.3em] text-primary uppercase">
            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            IA Preventiva de Saúde
          </div>
          
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tight leading-[1.1]">
              Cuidando do seu <span className="text-primary italic">pet</span><br className="hidden md:block" /> com inteligência
            </h2>
            <p className="text-zinc-500 max-w-md mx-auto text-[10px] md:text-[11px] leading-relaxed font-medium px-4 opacity-80">
              Análise inteligente de sintomas e nutrição animal. O bem-estar do seu amigo começa com a prevenção avançada da WS Studios.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4">
              <Button 
                onClick={() => setIsAnalysisModalOpen(true)}
                className="w-full sm:w-auto rounded-full px-8 h-12 text-[10px] font-black uppercase tracking-[0.25em] hover:scale-105 transition-all shadow-2xl shadow-primary/20 bg-primary text-black hover:bg-primary/90"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Iniciar Análise IA
              </Button>
              <Button 
                onClick={() => setIsCareGuideModalOpen(true)}
                variant="outline"
                className="w-full sm:w-auto rounded-full px-8 h-12 text-[10px] font-black uppercase tracking-[0.25em] hover:scale-105 transition-all border-zinc-800 hover:bg-zinc-900 text-white"
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Gerar Guia de Cuidados
              </Button>
            </div>

            {/* Aviso Importante */}
            <div className="flex items-center justify-center gap-2 text-zinc-600 animate-pulse">
              <AlertCircle className="w-3 h-3 text-primary/40" />
              <p className="text-[7px] font-bold uppercase tracking-[0.25em]">
                Importante: Leia os <Link href="/terms" className="text-zinc-400 hover:text-primary underline underline-offset-2 transition-colors">termos de uso</Link> no rodapé antes de iniciar.
              </p>
            </div>
          </div>
        </section>

        {/* Tecnologia WS Studios Card */}
        <section className="mt-8 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent p-5 text-center border border-white/5 max-w-md mx-auto">
          <div className="mb-3 flex justify-center">
            <div className="bg-primary/10 p-2 rounded-full ring-1 ring-primary/20">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
          </div>
          <h2 className="font-headline mb-1.5 text-sm font-bold">Tecnologia WS Studios</h2>
          <p className="mx-auto max-w-[280px] sm:max-w-none text-[9px] text-muted-foreground leading-relaxed italic opacity-70">
            Nossa missão é antecipar problemas e educar tutores. Lembre-se: o Vet IA orienta através de análise de dados, mas não substitui a consulta profissional.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 flex flex-col items-center gap-6 relative z-10">
        <div className="flex items-center gap-2 opacity-10 grayscale transition-opacity duration-700 hover:opacity-30 cursor-default">
          <div className="flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-primary" />
            <span className="text-lg font-headline font-bold tracking-tighter text-white">
              Vet <span className="text-primary italic">IA</span>
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="text-[9px] font-black text-zinc-900 uppercase tracking-[0.6em] text-center px-6">
            © {currentYear || '...'} Vet IA • Powered by WS Studios
          </div>
          <Link 
            href="/terms"
            className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.4em] hover:text-primary transition-all border-b border-zinc-900 hover:border-primary pb-0.5"
          >
            Termos de Uso
          </Link>
        </div>
      </footer>

      <AnalysisModal 
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        onSuccess={() => {}}
        type="text"
      />

      <CareGuideModal 
        isOpen={isCareGuideModalOpen}
        onClose={() => setIsCareGuideModalOpen(false)}
      />
    </div>
  );
}
