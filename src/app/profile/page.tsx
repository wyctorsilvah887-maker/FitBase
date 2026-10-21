"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { User, Mail, ShieldCheck, Calendar, LayoutDashboard, Dumbbell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    setCurrentDate(format(new Date(), "eeee, d 'de' MMMM", { locale: ptBR }));
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="animate-bounce">
            <Dumbbell className="w-16 h-16 text-primary" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
            Sincronizando <span className="text-primary italic">Perfil...</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body selection:bg-primary selection:text-black overflow-x-hidden">
      <Header />
      
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-4 md:pt-12 pb-32 space-y-20">
        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary backdrop-blur-md mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Central do Gestor FitBase
              </div>
              <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter uppercase leading-none">
                Olá, <span className="animate-text-flash italic inline-block pr-2">Bem-vindo</span>
              </h1>
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {currentDate}
              </p>
            </div>
            
            <Link href="/dashboard">
              <Button variant="ghost" className="h-12 px-6 rounded-2xl border border-border bg-card hover:bg-accent text-[9px] font-black uppercase tracking-widest transition-all group">
                <LayoutDashboard className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                Painel de Gestão
              </Button>
            </Link>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
            
            <Card className="relative z-10 bg-card border-border rounded-[3rem] overflow-hidden border-2 shadow-2xl transition-all hover:border-primary/40">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <CardContent className="p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                <div className="relative">
                  <div className="w-32 h-32 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-700">
                    <Image src="/logo fitbase.png" alt="FitBase" width={140} height={140} className="object-contain relative z-10" />
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail de Acesso</p>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                         <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-xl md:text-2xl font-headline font-bold text-foreground tracking-tight">{user.email || "Gestor em Teste"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="px-5 py-2.5 rounded-2xl bg-background border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-3 hover:border-primary/30 transition-all cursor-default">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                      Conta Ativa FitBase
                    </div>
                    <div className="px-5 py-2.5 rounded-2xl bg-background border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-3 hover:border-primary/30 transition-all cursor-default">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Segurança Blindada
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
