"use client";

import { useState } from "react";
import { ShieldCheck, PawPrint, Plus, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisModal } from "@/components/AnalysisModal";
import { ResultDetailsDialog } from "@/components/ResultDetailsDialog";
import { AnalysisEntry } from "@/app/lib/history-store";

export default function Home() {
  const [modalType, setModalType] = useState<'text' | 'image' | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<AnalysisEntry | null>(null);

  const openModal = (type: 'text' | 'image') => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-body overflow-x-hidden">
      <div className="fixed inset-0 bg-noise pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center">
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <PawPrint className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-headline font-bold tracking-tighter">
              Vet <span className="text-primary italic">IA</span>
            </h1>
          </div>
        </div>

        <div className="absolute right-6 flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">CEO/WYCTOR</p>
          </div>
          <Avatar className="w-10 h-10 border-2 border-white/5">
            <AvatarImage src="https://picsum.photos/seed/wyctor/100/100" />
            <AvatarFallback>WY</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-24 space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[9px] font-black tracking-[0.3em] text-primary uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            IA Preventiva de Saúde
          </div>
          
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-headline font-bold tracking-tight leading-[1.1]">
              Cuidando do seu <span className="text-primary italic">pet</span> com IA
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed font-medium">
              Acompanhamento inteligente de sintomas e nutrição animal. O bem-estar do seu melhor amigo começa com a prevenção da WS Studios.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button 
              onClick={() => openModal('text')}
              className="rounded-full px-8 h-14 text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-lg shadow-primary/10"
            >
              Análise de Texto
            </Button>
            <Button 
              variant="outline"
              onClick={() => openModal('image')}
              className="rounded-full px-8 h-14 text-[10px] font-black uppercase tracking-[0.2em] border-white/10 hover:bg-primary/10 hover:border-primary transition-all"
            >
              Análise de Imagem
            </Button>
          </div>
        </section>

        {/* Pets Section */}
        <section className="space-y-8 max-w-md">
          <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-white uppercase">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Meus Pets
          </div>

          <div className="space-y-3">
            <Card className="bg-zinc-950 border-zinc-900/50 group cursor-pointer hover:border-primary/50 transition-all rounded-2xl">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12 rounded-xl border border-white/10">
                      <AvatarImage src="https://picsum.photos/seed/kira/100/100" />
                      <AvatarFallback>KI</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-tight">kira</h3>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">
                      Cachorro • Poodle
                    </p>
                  </div>
                </div>
                <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-primary/10 transition-colors">
                  <PawPrint className="w-3 h-3 text-zinc-500 group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            <button className="w-full h-20 rounded-2xl border-2 border-dashed border-zinc-900 flex items-center justify-center gap-3 text-zinc-700 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Adicionar Pet</span>
            </button>
          </div>
        </section>

        {/* Footer Card */}
        <section className="pt-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <Card className="relative bg-[#050505] border-zinc-900/50 rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-16 flex flex-col items-center text-center space-y-8">
                <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-headline font-bold tracking-tight">Tecnologia WS Studios</h3>
                  <p className="text-zinc-500 text-sm max-w-sm leading-relaxed font-medium">
                    Nossa missão é antecipar problemas e educar tutores. Lembre-se: o Vet IA orienta através de análise de dados, mas não substitui a consulta profissional.
                  </p>
                </div>
                <div className="flex items-center gap-8 pt-4 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
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

      <ResultDetailsDialog 
        entry={selectedEntry}
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}