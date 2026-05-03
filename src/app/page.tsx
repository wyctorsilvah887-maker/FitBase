"use client";

import { useState } from "react";
import { ShieldCheck, PawPrint, Plus, ChevronRight, CheckCircle2 } from "lucide-react";
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
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <PawPrint className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
          <h1 className="text-2xl font-headline font-bold tracking-tighter">
            Vet <span className="text-primary italic">IA</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold uppercase tracking-widest text-white">CEO/WYCTOR</p>
          </div>
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/ceo/100/100" />
            <AvatarFallback>WY</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            IA Preventiva de Saúde
          </div>
          
          <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tight leading-[0.95]">
            Cuidando do seu <span className="text-primary">pet</span> com IA
          </h2>
          
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Acompanhamento inteligente de sintomas e nutrição animal. O bem-estar do seu melhor amigo começa com a prevenção da WS Studios.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button 
              onClick={() => openModal('text')}
              className="rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Análise de Texto
            </Button>
            <Button 
              variant="outline"
              onClick={() => openModal('image')}
              className="rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest border-primary/20 hover:bg-primary/10 hover:border-primary transition-all"
            >
              Análise de Imagem
            </Button>
          </div>
        </section>

        {/* Pets Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white uppercase">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Meus Pets
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-zinc-950 border-zinc-900 group cursor-pointer hover:border-primary/50 transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 rounded-xl border border-white/10">
                    <AvatarImage src="https://picsum.photos/seed/kira/100/100" />
                    <AvatarFallback>KI</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">kira</h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Cachorro • Poodle
                    </p>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
                  <PawPrint className="w-4 h-4 text-primary" />
                </div>
              </CardContent>
            </Card>

            <button className="h-full min-h-[80px] rounded-2xl border-2 border-dashed border-zinc-900 flex items-center justify-center gap-3 text-zinc-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all">
              <Plus className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Adicionar Pet</span>
            </button>
          </div>
        </section>

        {/* Footer Card */}
        <section className="pt-12">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <Card className="relative bg-zinc-950 border-zinc-900 rounded-3xl overflow-hidden">
              <CardContent className="p-12 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-headline font-bold">Tecnologia WS Studios</h3>
                <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
                  Nossa missão é antecipar problemas e educar tutores. Lembre-se: o Vet IA orienta através de análise de dados, mas não substitui a consulta profissional.
                </p>
                <div className="flex items-center gap-6 pt-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> IA Avançada</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> 24/7 Suporte</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-[10px] font-medium text-zinc-600 uppercase tracking-[0.4em]">
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
