"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, Camera, ShieldCheck, Zap, Activity } from "lucide-react";
import { AnalysisModal } from "@/components/AnalysisModal";
import { HistoryList } from "@/components/HistoryList";
import { ResultDetailsDialog } from "@/components/ResultDetailsDialog";
import { AnalysisEntry } from "@/app/lib/history-store";

export default function Home() {
  const [modalType, setModalType] = useState<'text' | 'image' | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<AnalysisEntry | null>(null);

  const openModal = (type: 'text' | 'image') => setModalType(type);
  const closeModal = () => setModalType(null);

  const handleAnalysisSuccess = () => {
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-teal-100 py-6 px-4 md:px-8 mb-8 sticky top-0 z-10 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-primary tracking-tight">Vet IA</h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-accent" /> Rápido</span>
            <span className="flex items-center gap-1"><Activity className="w-4 h-4 text-accent" /> Preciso</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground leading-tight">
            Cuidado Animal <span className="text-primary">Inteligente</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Análise instantânea de ingredientes de rações e sintomas animais usando inteligência artificial avançada.
          </p>
        </section>

        {/* Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card 
            className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer shadow-lg hover:shadow-xl"
            onClick={() => openModal('text')}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <FileText className="w-24 h-24" />
            </div>
            <CardHeader className="relative z-10">
              <div className="w-14 h-14 bg-secondary flex items-center justify-center rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-2xl font-headline">Análise de Texto</CardTitle>
              <CardDescription className="text-base">
                Descreva sintomas ou digite ingredientes para uma análise detalhada.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <button className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                Começar análise textual →
              </button>
            </CardContent>
          </Card>

          <Card 
            className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer shadow-lg hover:shadow-xl"
            onClick={() => openModal('image')}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Camera className="w-24 h-24" />
            </div>
            <CardHeader className="relative z-10">
              <div className="w-14 h-14 bg-accent/20 flex items-center justify-center rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl font-headline">Análise de Imagem</CardTitle>
              <CardDescription className="text-base">
                Use a câmera ou envie fotos de rótulos de ração e sintomas visíveis.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <button className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                Capturar ou enviar foto →
              </button>
            </CardContent>
          </Card>
        </section>

        {/* History Section */}
        <section className="pt-8 border-t border-teal-100">
          <HistoryList 
            refreshTrigger={refreshHistory} 
            onSelect={setSelectedEntry}
          />
        </section>
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl mx-auto px-4 md:px-8 mt-16 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Vet IA - Assistente Veterinário Inteligente</p>
        <p className="mt-2 italic">Lembre-se: Consulte sempre um médico veterinário para diagnósticos definitivos.</p>
      </footer>

      {/* Modals */}
      <AnalysisModal 
        type={modalType}
        isOpen={!!modalType}
        onClose={closeModal}
        onSuccess={handleAnalysisSuccess}
      />

      <ResultDetailsDialog 
        entry={selectedEntry}
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}