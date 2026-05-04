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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[8px] font-black tracking-[0.4em] text-primary uppercase mx-auto backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            IA Preventiva de Saúde Animal
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight leading-[1.05]">
              Cuidando do seu <span className="text-primary italic">pet</span><br className="hidden md:block" /> com inteligência pura
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-[10px] md:text-[12px] leading-relaxed font-medium px-4 opacity-80 uppercase tracking-wide">
              Análise inteligente de sintomas e nutrição animal. O bem-estar do seu amigo começa com a prevenção avançada da WS Studios.
            </p>
          </div>
        </section>

        {/* Action Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          {/* Card Análise IA - Graphite & Gradient */}
          <div 
            onClick={handleStartAnalysis}
            className="group relative cursor-pointer"
          >
            {/* Glow Background Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-zinc-800 rounded-[2.5rem] blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative flex flex-col justify-between min-h-[260px] p-8 bg-zinc-950 border border-white/5 rounded-[2.5rem] transition-all duration-700 group-hover:bg-gradient-to-br group-hover:from-zinc-900 group-hover:to-black overflow-hidden shadow-2xl">
              {/* Graphite Texture / Glossy Overlay */}
              <div className="absolute inset-0 bg-noise opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center ring-1 ring-primary/20 group-hover:ring-primary/50 transition-all duration-700 shadow-inner group-hover:shadow-primary/20">
                  <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-headline font-bold uppercase tracking-tighter group-hover:text-primary transition-colors duration-500">Análise de Saúde IA</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.1em] leading-relaxed">
                    Descreva sintomas e receba uma análise preliminar instantânea baseada em dados veterinários globais.
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-4">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-4 transition-all duration-500">
                  Iniciar Análise <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Card Guia de Cuidados - Graphite & Gradient */}
          <div 
            onClick={handleGenerateGuide}
            className="group relative cursor-pointer"
          >
            {/* Glow Background Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-primary/30 rounded-[2.5rem] blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative flex flex-col justify-between min-h-[260px] p-8 bg-zinc-950 border border-white/5 rounded-[2.5rem] transition-all duration-700 group-hover:bg-gradient-to-br group-hover:from-zinc-900 group-hover:to-black overflow-hidden shadow-2xl">
              {/* Graphite Texture / Glossy Overlay */}
              <div className="absolute inset-0 bg-noise opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center ring-1 ring-primary/20 group-hover:ring-primary/50 transition-all duration-700 shadow-inner group-hover:shadow-primary/20">
                  <ClipboardList className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-headline font-bold uppercase tracking-tighter group-hover:text-primary transition-colors duration-500">Guia Personalizado</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.1em] leading-relaxed">
                    Gere um manual de cuidados específicos para a raça, idade e necessidades biológicas do seu pet.
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-4">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-4 transition-all duration-500">
                  Criar Manual <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tecnologia WS Studios Card */}
        <section className="mt-8 rounded-[2.5rem] bg-zinc-900/10 backdrop-blur-sm p-8 text-center border border-white/5 max-w-2xl mx-auto shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full ring-1 ring-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="font-headline mb-2 text-base font-bold uppercase tracking-widest">Tecnologia Preventiva WS Studios</h2>
          <p className="mx-auto max-w-[420px] text-[10px] text-muted-foreground leading-relaxed italic opacity-80 uppercase tracking-tighter">
            Nossa missão é antecipar problemas e educar tutores. Lembre-se: o Vet IA orienta através de análise de dados, mas não substitui a consulta profissional.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 flex flex-col items-center gap-8 relative z-10 border-t border-white/5">
        <div className="flex items-center gap-2 opacity-20 grayscale transition-all duration-1000 hover:opacity-100 hover:grayscale-0 cursor-default">
          <PawPrint className="w-5 h-5 text-primary" />
          <span className="text-xl font-headline font-bold tracking-tighter text-white">
            Vet <span className="text-primary italic">IA</span>
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.7em] text-center px-6">
            © {currentYear || '...'} Vet IA • Powered by WS Studios
          </div>
          <Link 
            href="/terms"
            className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.5em] hover:text-primary transition-all border-b border-transparent hover:border-primary pb-0.5"
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
