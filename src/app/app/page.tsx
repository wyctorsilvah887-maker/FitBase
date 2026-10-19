
"use client";

import Header from "@/components/Header";
import { 
  Dumbbell, 
  CreditCard, 
  Users, 
  Zap, 
  TrendingUp, 
  Smartphone, 
  ArrowRight,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

export default function GymLandingPage() {
  const heroImg = PlaceHolderImages?.find(img => img.id === 'gym-hero');
  const notebookImg = PlaceHolderImages?.find(img => img.id === 'notebook-comparison');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-body overflow-x-hidden">
      <Header />
      
      <main className="relative">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.07)_0%,transparent_70%)] pointer-events-none -z-10" />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-24 md:pb-32 text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-in fade-in duration-1000">
            <Zap className="w-3 h-3 animate-pulse" />
            O fim da era dos cadernos chegou
          </div>
          
          <h1 className="text-6xl md:text-9xl font-headline font-black tracking-tighter uppercase leading-[0.85] max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Aposente o <br /><span className="text-primary italic">Caderno</span> Hoje
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Digitalize sua academia com inteligência artificial. Controle pagamentos, alunos e crescimento sem perder uma única folha.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link href="/register">
              <Button size="lg" className="h-16 px-12 rounded-3xl bg-primary text-primary-foreground font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all w-full sm:w-auto">
                Começar Grátis <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-16 px-12 rounded-3xl border-2 border-border bg-card/50 font-black uppercase text-[12px] tracking-[0.2em] hover:bg-accent transition-all w-full sm:w-auto">
                Ver Demonstração
              </Button>
            </Link>
          </div>

          <div className="mt-24 relative group max-w-6xl mx-auto animate-in fade-in zoom-in duration-1000 delay-500">
             <div className="absolute -inset-4 bg-primary/10 rounded-[4rem] blur-3xl opacity-20 pointer-events-none" />
             <div className="relative rounded-[4rem] overflow-hidden border-2 border-border shadow-2xl aspect-[21/9]">
                {heroImg && (
                  <Image 
                    src={heroImg.imageUrl} 
                    alt={heroImg.description} 
                    fill 
                    className="object-cover" 
                    data-ai-hint={heroImg.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 flex items-center gap-6">
                  <div className="p-6 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/20">
                     <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                  <div className="text-left text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Digitalização FitFlow</p>
                    <p className="text-2xl font-headline font-bold uppercase tracking-tight">O Poder da Gestão na Palma da Mão</p>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-24 md:py-48 bg-accent/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">A Transformação Digital</h2>
                <h3 className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter leading-none">
                  Por que mudar do <span className="italic">Papel</span> para o <span className="text-primary italic">FitFlow</span>?
                </h3>
              </div>
              
              <div className="grid gap-8">
                <FeatureItem icon={<BookOpen className="text-red-500" />} title="Adeus aos Rasuras" text="Chega de nomes ilegíveis, folhas soltas e borrões de suor no seu controle." />
                <FeatureItem icon={<Zap className="text-amber-500" />} title="Velocidade Instantânea" text="Localize qualquer aluno ou pagamento em 2 segundos, não em 2 minutos." />
                <FeatureItem icon={<TrendingUp className="text-emerald-500" />} title="Análise IA" text="O caderno não te avisa quem vai sair. Nossa IA sim." />
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-[3rem] overflow-hidden border-2 border-border shadow-2xl aspect-[4/5] lg:aspect-square">
                {notebookImg && (
                  <Image src={notebookImg.imageUrl} alt="Comparison" fill className="object-cover" data-ai-hint={notebookImg.imageHint} />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-card border-2 border-border p-8 rounded-[2rem] shadow-2xl max-w-[280px] animate-bounce-slow">
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Relatório do Mês</p>
                 <p className="text-2xl font-headline font-bold">+28% Retenção</p>
                 <p className="text-xs text-muted-foreground mt-2">Calculado via FitFlow IA</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-48 px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-12 bg-foreground text-background p-16 md:p-32 rounded-[4rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <h2 className="text-5xl md:text-8xl font-headline font-black uppercase tracking-tighter leading-none">
              Sua Academia <br /><span className="text-primary italic">Escalável.</span>
            </h2>
            <p className="text-background/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Junte-se a centenas de proprietários que já digitalizaram sua gestão e aumentaram seus lucros.
            </p>
            <div className="flex justify-center pt-8">
               <Link href="/register">
                 <Button size="lg" className="h-20 px-16 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase text-[14px] tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-primary/30">
                   Criar Minha Conta Grátis
                 </Button>
               </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-border bg-card/50">
           <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex items-center gap-3">
                 <Dumbbell className="w-8 h-8 text-primary" />
                 <span className="text-2xl font-headline font-bold uppercase tracking-tighter">FitFlow <span className="text-primary italic">IA</span></span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                 © 2026 WS Studios Company • Digital Smart Gym
              </p>
              <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
                 <Link href="/terms" className="hover:text-primary transition-colors">Termos</Link>
                 <Link href="/login" className="hover:text-primary transition-colors">Gestão</Link>
                 <Link href="/" className="hover:text-primary transition-colors">Suporte</Link>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureItem({ icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="flex gap-6 items-start group">
      <div className="w-14 h-14 rounded-2xl bg-card border-2 border-border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-xl font-headline font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed font-medium">{text}</p>
      </div>
    </div>
  );
}
