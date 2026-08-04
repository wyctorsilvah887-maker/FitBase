
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { 
  Wind, 
  ThermometerSnowflake, 
  Wrench, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  History,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ACAnalysisModal } from "@/components/ACAnalysisModal";
import { ACMaintenanceModal } from "@/components/ACMaintenanceModal";
import Link from "next/link";

export default function HomePage() {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-body overflow-x-hidden">
      <div className="bg-noise" />
      <Header />
      
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-32">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Inteligência em Climatização WS Studios Company
          </div>
          
          <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tighter uppercase leading-[0.85]">
            O Futuro do <br />
            <span className="animate-text-flash italic inline-block pr-4">Conforto Térmico</span>
          </h1>
          
          <p className="max-w-2xl text-muted-foreground text-sm md:text-lg font-medium leading-relaxed">
            Diagnósticos precisos, guias de manutenção inteligente e suporte técnico avançado 
            movido por IA para sistemas de ar condicionado residenciais e industriais.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
              onClick={() => setIsAnalysisOpen(true)}
            >
              Diagnosticar Problema <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 rounded-2xl border-2 border-border bg-card/50 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-accent transition-all"
              onClick={() => setIsGuideOpen(true)}
            >
              Criar Guia Técnico
            </Button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <FeatureCard 
            icon={<ThermometerSnowflake className="w-6 h-6" />}
            title="Eficiência Energética"
            desc="Análise inteligente para reduzir o consumo de energia do seu sistema."
            color="bg-blue-500/10"
          />
          <FeatureCard 
            icon={<Wrench className="w-6 h-6" />}
            title="Manutenção Preditiva"
            desc="Antecipe falhas no compressor e vazamentos antes que aconteçam."
            color="bg-cyan-500/10"
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Protocolo de Segurança"
            desc="Diretrizes técnicas seguindo as normas ABNT e PMOC."
            color="bg-indigo-500/10"
          />
        </section>

        {/* Info Bar */}
        <div className="mt-32 p-8 rounded-[3rem] bg-card border-2 border-border relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-50" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-icon-flash">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline font-bold uppercase tracking-tight">Suporte Premium</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Tecnologia Preventiva WS Studios Company</p>
              </div>
            </div>
            <Link href="/terms">
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                Ver Termos de Uso
              </Button>
            </Link>
          </div>
        </div>

        <footer className="mt-20 text-center space-y-4 opacity-50">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
            © 2026 Clima IA • Powered by WS Studios Company
          </p>
          <div className="flex justify-center gap-8 text-[9px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><Zap className="w-3 h-3 text-primary" /> Alta Performance</span>
            <span className="flex items-center gap-2"><History className="w-3 h-3 text-primary" /> Histórico em Nuvem</span>
          </div>
        </footer>
      </main>

      <ACAnalysisModal isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} />
      <ACMaintenanceModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <Card className="group relative bg-card border-2 border-border rounded-[2.5rem] overflow-hidden transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5">
      <CardContent className="p-10 space-y-6">
        <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-headline font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {desc}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
