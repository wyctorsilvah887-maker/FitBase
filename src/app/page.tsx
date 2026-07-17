"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Sparkles, ClipboardList, PawPrint, ChevronRight } from "lucide-react";
import { AnalysisModal } from "@/components/AnalysisModal";
import { CareGuideModal } from "@/components/CareGuideModal";
import { TermsAcceptanceModal } from "@/components/TermsAcceptanceModal";
import Header from "@/components/Header";
import Link from "next/link";
import { useUser, useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";

export default function Home() {
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isCareGuideModalOpen, setIsCareGuideModalOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [activeSweep, setActiveSweep] = useState<string | null>(null);
  
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleStartAnalysis = () => {
    if (activeSweep) return;
    setActiveSweep('analysis');
    setTimeout(() => {
      setActiveSweep(null);
      if (!user) {
        router.push('/login');
        return;
      }
      setIsAnalysisModalOpen(true);
    }, 600);
  };

  const handleGenerateGuide = () => {
    if (activeSweep) return;
    setActiveSweep('guide');
    setTimeout(() => {
      setActiveSweep(null);
      if (!user) {
        router.push('/login');
        return;
      }
      setIsCareGuideModalOpen(true);
    }, 600);
  };

  const handleSuccess = () => {
    // Registro efetuado com sucesso
  };

  const showTermsModal = user && !isUserDataLoading && (!userData || !userData.acceptedTerms);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black font-body overflow-x-hidden">
      <div className="bg-noise" />
      
      <Header />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-4 md:pt-8 pb-24 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[8px] font-black tracking-[0.4em] text-primary uppercase mx-auto backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            IA Preventiva de Saúde Animal
          </div>
          
          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight leading-[1.05]">
              Cuidando do seu <span className="animate-text-flash italic inline-block pr-2">pet</span><br className="hidden md:block" /> com inteligência pura
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-[10px] md:text-[11px] leading-relaxed font-medium px-4 opacity-80 uppercase tracking-wide">
              Análise inteligente de sintomas e nutrição animal. O bem-estar do seu amigo começa com a prevenção avançada da WS Studios.
            </p>
          </div>
        </section>

        {/* Action Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          {/* Card Análise IA */}
          <div 
            onClick={handleStartAnalysis}
            className="group relative cursor-pointer"
          >
            <div className="relative flex flex-col justify-between min-h-[200px] p-8 bg-card border border-primary/30 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-primary/60">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
              
              {activeSweep === 'analysis' && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-sweep" />
                </div>
              )}

              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-background border border-primary/30 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-headline font-bold uppercase tracking-tighter">Análise de Saúde IA</h3>
                  <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-[0.1em] leading-relaxed">
                    Descreva sintomas e receba uma análise instantânea.
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-2">
                <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-3 transition-all">
                  Iniciar Análise <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Card Guia de Cuidados */}
          <div 
            onClick={handleGenerateGuide}
            className="group relative cursor-pointer"
          >
            <div className="relative flex flex-col justify-between min-h-[200px] p-8 bg-card border border-primary/30 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-primary/60">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>

              {activeSweep === 'guide' && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-sweep" />
                </div>
              )}

              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-background border border-primary/30 flex items-center justify-center shadow-inner">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-headline font-bold uppercase tracking-tighter">Guia Personalizado</h3>
                  <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-[0.1em] leading-relaxed">
                    Gere um manual de cuidados para o seu pet.
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-2">
                <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-3 transition-all">
                  Criar Manual <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tecnologia WS Studios Card - Enhanced Design */}
        <section className="mt-4 relative group max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <div className="relative rounded-[2.5rem] bg-card border border-primary/20 p-8 text-center overflow-hidden shadow-2xl transition-all hover:border-primary/40">
            {/* Subtle premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="mb-5 flex justify-center">
                <div className="bg-background border border-primary/30 p-3.5 rounded-2xl shadow-inner shadow-primary/5 group-hover:scale-110 transition-transform duration-500 group-hover:border-primary/60">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="font-headline mb-3 text-[11px] font-black uppercase tracking-[0.3em]">
                Tecnologia Preventiva <span className="animate-text-flash italic inline-block">WS Studios</span>
              </h2>
              <p className="mx-auto max-w-[420px] text-[9px] text-muted-foreground leading-relaxed font-bold opacity-80 uppercase tracking-widest px-4">
                Nossa missão é antecipar problemas e educar tutores. Lembre-se: o Vet IA orienta através de análise de dados, mas não substitui a consulta profissional.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 flex flex-col items-center gap-8 relative z-10 border-t border-border/50">
        <div className="flex items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 cursor-default transition-all duration-700">
          <PawPrint className="w-5 h-5 text-primary" />
          <span className="text-xl font-headline font-bold tracking-tighter">
            Vet <span className="text-primary italic">IA</span>
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.7em] text-center px-6">
            © {currentYear || '...'} Vet IA • Powered by WS Studios
          </div>
          <Link 
            href="/terms"
            className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.5em] hover:text-primary transition-all border-b border-transparent hover:border-primary pb-0.5"
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

      {showTermsModal && <TermsAcceptanceModal isOpen={true} />}
    </div>
  );
}