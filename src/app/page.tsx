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
  Info,
  CheckCircle2,
  Cpu,
  BarChart3,
  MousePointer2,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ACAnalysisModal } from "@/components/ACAnalysisModal";
import { ACMaintenanceModal } from "@/components/ACMaintenanceModal";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Seleção segura das imagens de placeholder para o tema de climatização
  const heroImg = PlaceHolderImages?.find(img => img.id === 'hero-hvac');
  const serviceInstall = PlaceHolderImages?.find(img => img.id === 'service-install');
  const serviceClean = PlaceHolderImages?.find(img => img.id === 'service-clean');
  const serviceRepair = PlaceHolderImages?.find(img => img.id === 'service-repair');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-body overflow-x-hidden">
      <div className="bg-noise" />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-20 md:pt-20 md:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary backdrop-blur-md w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Inteligência WS Studios Company
            </div>
            
            <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tighter uppercase leading-[0.85]">
              Eficiência <br />
              <span className="animate-text-flash italic inline-block pr-4 text-primary">Inteligente</span>
            </h1>
            
            <p className="max-w-xl text-muted-foreground text-sm md:text-lg font-medium leading-relaxed">
              Diagnósticos ultra-precisos e protocolos de manutenção movidos por IA para sistemas de climatização residenciais e industriais. Aumente a vida útil do seu equipamento hoje.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
                onClick={() => setIsAnalysisOpen(true)}
              >
                Diagnóstico Instantâneo <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 rounded-2xl border-2 border-border bg-card/50 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-accent transition-all"
                onClick={() => setIsGuideOpen(true)}
              >
                Gerar Protocolo Técnico
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-accent flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i+10}/100`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">
                +1.200 Especialistas Utilizando
              </p>
            </div>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border-2 border-border shadow-2xl">
              {heroImg && (
                <Image 
                  src={heroImg.imageUrl} 
                  alt={heroImg.description} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  data-ai-hint={heroImg.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/90 flex items-center justify-center text-white backdrop-blur-md">
                    <Play className="w-5 h-5 fill-white" />
                  </div>
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Veja a IA em Ação</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                  <span className="text-white text-[10px] font-bold">98.4% Precisão</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-accent/30 py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Tecnologia Preventiva WS Studios Company</h2>
              <h3 className="text-4xl md:text-6xl font-headline font-bold uppercase tracking-tighter">Soluções <span className="italic animate-text-flash">Termo-Digitais</span></h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Cpu className="w-6 h-6" />}
                title="Diagnóstico via Genkit"
                desc="Nossa IA analisa sintomas e códigos de erro em segundos, sugerindo a causa raiz da falha técnica."
                color="bg-blue-500/10"
              />
              <FeatureCard 
                icon={<BarChart3 className="w-6 h-6" />}
                title="Eficiência PMOC"
                desc="Geração automática de protocolos de manutenção preventiva conforme normas vigentes da ABNT."
                color="bg-cyan-500/10"
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-6 h-6" />}
                title="Segurança Elétrica"
                desc="Protocolos rigorosos para manuseio de componentes eletrônicos e fluídos refrigerantes inflamáveis."
                color="bg-indigo-500/10"
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 md:py-32 max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-12">
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Serviços Especializados</h2>
                <h3 className="text-4xl md:text-5xl font-headline font-bold uppercase tracking-tighter">Protocolos para toda a <span className="italic">Jornada do Equipamento</span></h3>
              </div>
              
              <div className="space-y-6">
                <ServiceItem 
                  title="Instalação Otimizada" 
                  desc="Cálculos de carga térmica e diretrizes de infraestrutura para máxima performance energética." 
                />
                <ServiceItem 
                  title="Higienização Bacteriológica" 
                  desc="Protocolos de limpeza química e mecânica para garantir a qualidade do ar interior (QAI)." 
                />
                <ServiceItem 
                  title="Manutenção Preditiva" 
                  desc="Monitoramento inteligente para antecipar a quebra do compressor e vazamentos de fluído." 
                />
              </div>

              <Button 
                onClick={() => setIsGuideOpen(true)}
                className="h-14 px-8 rounded-2xl bg-foreground text-background font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all"
              >
                Começar agora <Zap className="ml-2 w-4 h-4 text-primary" />
              </Button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="relative rounded-[2rem] overflow-hidden border-2 border-border shadow-xl aspect-square">
                  {serviceInstall && <Image src={serviceInstall.imageUrl} alt={serviceInstall.description} fill className="object-cover" data-ai-hint={serviceInstall.imageHint} />}
                </div>
                <div className="relative rounded-[2rem] overflow-hidden border-2 border-border shadow-xl aspect-[4/5]">
                   {serviceClean && <Image src={serviceClean.imageUrl} alt={serviceClean.description} fill className="object-cover" data-ai-hint={serviceClean.imageHint} />}
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative rounded-[2rem] overflow-hidden border-2 border-border shadow-xl aspect-[4/5]">
                  {serviceRepair && <Image src={serviceRepair.imageUrl} alt={serviceRepair.description} fill className="object-cover" data-ai-hint={serviceRepair.imageHint} />}
                </div>
                <div className="bg-primary p-8 rounded-[2rem] text-white flex flex-col justify-end aspect-square">
                  <h4 className="text-3xl font-headline font-black uppercase tracking-tighter leading-none mb-2">+5.0k</h4>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Diagnósticos Gerados este mês</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-card/50 border-y border-border py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">FAQ</h2>
              <h3 className="text-3xl font-headline font-bold uppercase tracking-tighter">Perguntas Frequentes</h3>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-2 border-border rounded-[1.5rem] px-6">
                <AccordionTrigger className="text-[11px] font-black uppercase tracking-widest hover:no-underline hover:text-primary transition-colors">A IA substitui o técnico?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed font-medium pb-6">
                  Não. O Clima IA é um assistente de engenharia para agilizar diagnósticos e garantir que os protocolos de segurança e eficiência sejam seguidos. A intervenção física sempre deve ser feita por um profissional.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-2 border-border rounded-[1.5rem] px-6">
                <AccordionTrigger className="text-[11px] font-black uppercase tracking-widest hover:no-underline hover:text-primary transition-colors">Como funciona o limite diário?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed font-medium pb-6">
                  Usuários anônimos têm acesso limitado para testes. Especialistas cadastrados possuem uma cota diária expandida para uso profissional em campo.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-2 border-border rounded-[1.5rem] px-6">
                <AccordionTrigger className="text-[11px] font-black uppercase tracking-widest hover:no-underline hover:text-primary transition-colors">Os dados são seguros?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed font-medium pb-6">
                  Sim. Utilizamos criptografia de ponta a ponta via Firebase e Genkit para garantir que seu histórico de diagnósticos e protocolos esteja sempre protegido.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 text-center">
          <div className="bg-foreground rounded-[3rem] p-12 md:p-24 space-y-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-50" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-4xl md:text-7xl font-headline font-bold text-background uppercase tracking-tighter leading-none">
                Pronto para <br /> <span className="text-primary italic">Refrigerar o Futuro?</span>
              </h3>
              <p className="text-background/60 text-sm md:text-lg max-w-2xl mx-auto font-medium">
                Junte-se a milhares de técnicos que estão elevando o nível da climatização com inteligência artificial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all"
                  onClick={() => setIsAnalysisOpen(true)}
                >
                  Começar Diagnóstico <MousePointer2 className="ml-2 w-4 h-4" />
                </Button>
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-14 px-8 rounded-2xl border-2 border-background/20 bg-transparent text-background font-black uppercase text-[10px] tracking-[0.2em] hover:bg-background/10 transition-all"
                  >
                    Entrar como Especialista
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/30 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 pb-20">
            <div className="space-y-6 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <Wind className="w-8 h-8 text-primary" />
                <h4 className="text-2xl font-headline font-bold tracking-tighter uppercase">Clima <span className="text-primary italic">IA</span></h4>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs font-medium leading-relaxed">
                Transformando a climatização através da inteligência artificial generativa. Uma iniciativa WS Studios Company.
              </p>
            </div>
            
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest">Tecnologia</h5>
              <ul className="space-y-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                <li><Link href="/" className="hover:text-primary transition-colors">Diagnósticos</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Protocolos PMOC</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Genkit Integration</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest">Institucional</h5>
              <ul className="space-y-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                <li><Link href="/terms" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link href="/profile" className="hover:text-primary transition-colors">Área do Técnico</Link></li>
                <li><Link href="https://wsstudios.company" className="hover:text-primary transition-colors">WS Studios Company</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 opacity-50">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
              © 2026 Clima IA • Powered by WS Studios Company
            </p>
            <div className="flex gap-8 text-[9px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2"><Zap className="w-3 h-3 text-primary" /> Alta Performance</span>
              <span className="flex items-center gap-2"><History className="w-3 h-3 text-primary" /> Histórico em Nuvem</span>
            </div>
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

function ServiceItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1 transition-colors group-hover:bg-primary group-hover:text-white">
        <CheckCircle2 className="w-3.5 h-3.5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
