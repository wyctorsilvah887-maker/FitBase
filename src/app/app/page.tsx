
"use client";

import Header from "@/components/Header";
import { 
  Wind, 
  Zap, 
  ShieldCheck, 
  Search, 
  Wrench, 
  Smartphone, 
  BarChart3, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Star,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

export default function AppLandingPage() {
  const heroImg = PlaceHolderImages?.find(img => img.id === 'hero-hvac');
  const serviceRepair = PlaceHolderImages?.find(img => img.id === 'service-repair');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-body overflow-x-hidden">
      <Header />
      
      <main className="relative">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05)_0%,transparent_70%)] pointer-events-none -z-10" />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-24 md:pb-32">
          <div className="text-center space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <Zap className="w-3 h-3 animate-pulse" />
              Revolucionando o HVAC com GenAI
            </div>
            
            <h1 className="text-5xl md:text-8xl font-headline font-black tracking-tighter uppercase leading-[0.9]">
              Sua Oficina no <span className="text-primary italic animate-text-flash">Futuro</span>
            </h1>
            
            <p className="text-muted-foreground text-sm md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              A plataforma definitiva para técnicos e empresas de climatização. Diagnósticos precisos, gestão de ordens e protocolos PMOC em um só lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all w-full sm:w-auto">
                  Criar Conta Técnica <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-2 border-border bg-card/50 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-accent transition-all w-full sm:w-auto">
                  Acessar Painel
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20 relative group max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000 delay-300">
             <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-3xl opacity-20 pointer-events-none" />
             <div className="relative rounded-[3rem] overflow-hidden border-2 border-border shadow-2xl aspect-[16/9]">
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
                <div className="absolute bottom-10 left-10 flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                     <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div className="text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Demonstração</p>
                    <p className="text-lg font-headline font-bold uppercase tracking-tight">Como o Clima IA funciona</p>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24 bg-accent/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <BenefitCard 
                icon={<Cpu className="w-8 h-8" />}
                title="IA Especialista"
                desc="Treinada com milhares de manuais técnicos para diagnosticar falhas em segundos."
              />
              <BenefitCard 
                icon={<ShieldCheck className="w-8 h-8" />}
                title="Protocolos PMOC"
                desc="Gere relatórios de manutenção preventiva em conformidade com as normas ABNT."
              />
              <BenefitCard 
                icon={<Smartphone className="w-8 h-8" />}
                title="Offline First"
                desc="Registre dados em campo mesmo sem internet. Sincronização automática na nuvem."
              />
            </div>
          </div>
        </section>

        {/* Features Detailed */}
        <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 space-y-32">
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                Gestão Inteligente
              </div>
              <h2 className="text-4xl md:text-6xl font-headline font-bold uppercase tracking-tighter leading-[0.9]">
                Ordens de Serviço <br /><span className="text-primary italic">Sem Papelada</span>
              </h2>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Abandone o papel. Cadastre clientes, equipamentos e técnicos em uma interface fluida. Acompanhe o status de cada OS em tempo real no seu dashboard.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Atribuição instantânea de técnicos
                </li>
                <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Cálculo automático de orçamentos
                </li>
                <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Histórico completo por cliente
                </li>
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square rounded-[3rem] bg-card border-2 border-border shadow-2xl relative overflow-hidden">
                {serviceRepair && (
                  <Image src={serviceRepair.imageUrl} alt="Feature Image" fill className="object-cover opacity-80" data-ai-hint="technician working" />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-24 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">O que dizem os especialistas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              <TestimonialCard 
                name="Ricardo Santos"
                role="Mestre de Refrigeração"
                content="O Clima IA reduziu meu tempo de diagnóstico em 70%. É como ter um engenheiro sênior no bolso o tempo todo."
              />
              <TestimonialCard 
                name="Ana Cláudia"
                role="Gestora de Manutenção"
                content="A facilidade de gerar protocolos PMOC mudou o patamar da minha empresa. Os clientes sentem muito mais confiança."
              />
              <TestimonialCard 
                name="Marcos Viana"
                role="Técnico Autônomo"
                content="O sistema de escala e histórico me ajuda a não perder nenhum detalhe dos meus atendimentos. Indispensável."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-48 px-6 text-center overflow-hidden relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full -z-10" />
          <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-7xl font-headline font-black uppercase tracking-tighter leading-none">
              Pronto para <br /> <span className="text-primary italic animate-text-flash">Escalar seu Negócio?</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg">
              Comece agora gratuitamente e descubra por que milhares de técnicos estão escolhendo a Clima IA para modernizar sua rotina.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/register">
                 <Button size="lg" className="h-16 px-12 rounded-2xl bg-foreground text-background font-black uppercase text-[11px] tracking-[0.2em] hover:scale-105 transition-all">
                   Criar Minha Conta <Zap className="ml-2 w-4 h-4 text-primary" />
                 </Button>
               </Link>
            </div>
          </div>
        </section>

        {/* Footer Minimal */}
        <footer className="py-12 border-t border-border bg-card/30">
           <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-2">
                 <Wind className="w-6 h-6 text-primary" />
                 <span className="text-lg font-headline font-bold uppercase tracking-tighter">Clima <span className="text-primary italic">IA</span></span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                 © 2026 WS Studios Company • Protocolo Clima IA
              </p>
              <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest">
                 <Link href="/terms" className="hover:text-primary transition-colors">Termos</Link>
                 <Link href="/login" className="hover:text-primary transition-colors">Acesso</Link>
                 <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="space-y-6 group">
      <div className="w-16 h-16 rounded-[1.5rem] bg-card border-2 border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-primary/5">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-headline font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, content }: { name: string, role: string, content: string }) {
  return (
    <Card className="rounded-[2.5rem] border-2 border-border bg-card p-8 space-y-6 hover:border-primary/40 transition-all group">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-primary fill-primary" />)}
      </div>
      <p className="text-sm italic font-medium leading-relaxed opacity-80">"{content}"</p>
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center overflow-hidden">
           <img src={`https://picsum.photos/seed/${name}/100`} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest">{name}</h4>
          <p className="text-[9px] font-bold text-muted-foreground uppercase">{role}</p>
        </div>
      </div>
    </Card>
  );
}
