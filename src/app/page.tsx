
"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Sparkles, ClipboardList, PawPrint, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisModal } from "@/components/AnalysisModal";
import { CareGuideModal } from "@/components/CareGuideModal";
import Header from "@/components/Header";
import Link from "next/link";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isCareGuideModalOpen, setIsCareGuideModalOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleStartAnalysis = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsAnalysisModalOpen(true);
  };

  const handleGenerateGuide = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsCareGuideModalOpen(true);
  };

  const handleSuccess = () => {
    // Registro efetuado com sucesso
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-body overflow-x-hidden">
      <div className="bg-noise" />
      
      <Header />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-8 md:pt-16 pb-24 space-y-12 md:space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[7px] font-black tracking-[0.3em] text-primary uppercase mx-auto">
            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            IA Preventiva de Saúde Animal
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tight leading-[1.1]">
              Cuidando do seu <span className="text-primary italic">pet</span><br className="hidden md:block" /> com inteligência pura
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-[10px] md:text-[11px] leading-relaxed font-medium px-4 opacity-80">
              Análise inteligente de sintomas e nutrição animal. O bem-estar do seu amigo começa com a prevenção avançada da WS Studios.
            </p>
          </div>
        </section>

        {/* Action Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          {/* Card Análise IA */}
          <div 
            onClick={handleStartAnalysis}
            className="group cursor-pointer bg-zinc-900/30 border border-white/5 hover:border-primary/30 p-6 md:p-8 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.01] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[260px] md:min-h-[280px]"
          >
            <div className="absolute -top-10 -right-10 p-4 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700">
              <Sparkles className="w-40 h-40 text-primary" />
            </div>
            
            <div className="relative z-10 space-y-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 group-hover:rotate-12 transition-all duration-500">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-headline font-bold uppercase tracking-tighter">Análise de Saúde IA</h3>
                <p className="text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                  Descreva sintomas e receba uma análise preliminar baseada em dados veterinários.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-4">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-primary group-hover:gap-4 transition-all">
                Iniciar Análise <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card Guia de Cuidados */}
          <div 
            onClick={handleGenerateGuide}
            className="group cursor-pointer bg-zinc-900/30 border border-white/5 hover:border-primary/30 p-6 md:p-8 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.01] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[260px] md:min-h-[280px]"
          >
            <div className="absolute -top-10 -right-10 p-4 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700">
              <ClipboardList className="w-40 h-40 text-primary" />
            </div>
            
            <div className="relative z-10 space-y-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 group-hover:-rotate-12 transition-all duration-500">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-headline font-bold uppercase tracking-tighter">Guia Personalizado</h3>
                <p className="text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                  Gere um manual de cuidados específicos para a raça e necessidades do seu pet.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-4">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-primary group-hover:gap-4 transition-all">
                Criar Manual <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* Tecnologia WS Studios Card */}
        <section className="mt-4 rounded-[2rem] bg-gradient-to-b from-white/[0.02] to-transparent p-6 text-center border border-white/5 max-w-xl mx-auto">
          <div className="mb-3 flex justify-center">
            <div className="bg-primary/10 p-2.5 rounded-full ring-1 ring-primary/20">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
          </div>
          <h2 className="font-headline mb-1 text-sm font-bold uppercase tracking-tight">Tecnologia Preventiva WS Studios</h2>
          <p className="mx-auto max-w-[360px] text-[9px] text-muted-foreground leading-relaxed italic opacity-70">
            Nossa missão é antecipar problemas e educar tutores. Lembre-se: o Vet IA orienta através de análise de dados, mas não substitui a consulta profissional.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 flex flex-col items-center gap-6 relative z-10">
        <div className="flex items-center gap-2 opacity-10 grayscale transition-opacity duration-700 hover:opacity-40 cursor-default">
          <PawPrint className="w-4 h-4 text-primary" />
          <span className="text-base font-headline font-bold tracking-tighter text-white">
            Vet <span className="text-primary italic">IA</span>
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.6em] text-center px-6">
            © {currentYear || '...'} Vet IA • Powered by WS Studios
          </div>
          <Link 
            href="/terms"
            className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.4em] hover:text-primary transition-all border-b border-transparent hover:border-primary pb-0.5"
          >
            Termos de Uso
          </Link>
        </div>
      </footer>

      <AnalysisModal 
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        onSuccess={handleSuccess}
        type="text"
      />

      <CareGuideModal 
        isOpen={isCareGuideModalOpen}
        onClose={() => setIsCareGuideModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
