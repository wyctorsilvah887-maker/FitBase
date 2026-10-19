'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Dumbbell } from 'lucide-react';
import Header from '@/components/Header';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-body overflow-x-hidden">
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-8 -ml-2 gap-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-full transition-all group h-8"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> 
          <span className="text-[9px] font-black uppercase tracking-widest">Retornar</span>
        </Button>

        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <div className="bg-card border-2 border-primary/20 p-4 rounded-[1.5rem] shadow-2xl shadow-primary/5 animate-icon-flash relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
               <ShieldCheck className="h-8 w-8 text-primary relative z-10" />
            </div>
            <div className="space-y-1">
              <h1 className="font-headline text-2xl md:text-4xl font-bold tracking-tighter uppercase leading-none">
                Termos de <span className="animate-text-flash italic inline-block pr-2">Uso</span>
              </h1>
              <p className="text-[8px] md:text-[9px] uppercase font-black tracking-[0.3em] text-muted-foreground">
                WS Studios • FitFlow • v2026.1
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none rounded-[1.5rem]" />
              <div className="relative z-10 bg-card border border-border p-5 md:p-6 rounded-[1.5rem] space-y-3 hover:border-primary/20 transition-all">
                <h2 className="text-base font-headline font-bold flex items-center gap-2">
                  <span className="text-primary italic text-xl font-black tracking-tighter">01.</span> 
                  <span className="uppercase tracking-tight text-[13px] md:text-base">Plataforma Digital</span>
                </h2>
                <p className="text-[11px] md:text-sm leading-relaxed text-muted-foreground font-medium">
                  O FitFlow é uma ferramenta de gestão digital para academias. O usuário declara estar ciente de que a plataforma visa substituir cadernos físicos por um sistema de nuvem seguro.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none rounded-[1.5rem]" />
              <div className="relative z-10 bg-card border border-border p-5 md:p-6 rounded-[1.5rem] space-y-3 hover:border-primary/20 transition-all">
                <h2 className="text-base font-headline font-bold flex items-center gap-2">
                  <span className="text-primary italic text-xl font-black tracking-tighter">02.</span> 
                  <span className="uppercase tracking-tight text-[13px] md:text-base">Responsabilidade</span>
                </h2>
                <p className="text-[11px] md:text-sm leading-relaxed text-muted-foreground font-medium">
                  Os dados inseridos são de inteira responsabilidade do gestor da academia. O FitFlow não processa pagamentos bancários diretamente, funcionando como um registro de recebíveis.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none rounded-[1.5rem]" />
              <div className="relative z-10 bg-card border border-border p-5 md:p-6 rounded-[1.5rem] space-y-3 hover:border-primary/20 transition-all">
                <h2 className="text-base font-headline font-bold flex items-center gap-2">
                  <span className="text-primary italic text-xl font-black tracking-tighter">03.</span> 
                  <span className="uppercase tracking-tight text-[13px] md:text-base">Privacidade</span>
                </h2>
                <p className="text-[11px] md:text-sm leading-relaxed text-muted-foreground font-medium">
                  Seus dados e de seus alunos são protegidos conforme a LGPD. O FitFlow utiliza criptografia para garantir que apenas o dono da conta tenha acesso aos registros de alunos e pagamentos.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center">
            <div className="flex items-center justify-center space-x-2 opacity-30 group cursor-default mb-4">
              <Dumbbell className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-headline text-base font-bold tracking-tighter">
                FitFlow
              </span>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground">
              Desenvolvido por <span className="animate-text-flash italic inline-block">WS Studios Company</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
