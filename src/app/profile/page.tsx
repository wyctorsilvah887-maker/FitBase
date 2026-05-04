
"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { HistoryList } from '@/components/HistoryList';
import { History, User, Mail, ShieldCheck, PawPrint, Calendar, Zap, LayoutDashboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center animate-icon-flash relative overflow-hidden border border-primary/20">
             <PawPrint className="w-8 h-8 text-primary relative z-10" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 animate-pulse">
            Sincronizando <span className="text-primary italic">Protocolo...</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-primary selection:text-black overflow-x-hidden">
      <div className="bg-noise" />
      <Header />
      
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-4 md:pt-12 pb-32 space-y-20">
        {/* User Info Header */}
        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-[9px] font-black uppercase tracking-[0.3em] text-primary backdrop-blur-md mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Central do Tutor WS Studios
              </div>
              <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter uppercase leading-none">
                Olá, <span className="animate-text-flash italic inline-block pr-2">Bem-vindo</span>
              </h1>
              <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.3em] flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {currentDate}
              </p>
            </div>
            
            <Link href="/">
              <Button variant="ghost" className="h-12 px-6 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 text-[9px] font-black uppercase tracking-[0.3em] transition-all group">
                <LayoutDashboard className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                Painel Geral
              </Button>
            </Link>
          </div>

          <div className="relative group">
            {/* Subtle premium glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
            
            <Card className="relative z-10 bg-black border-primary/20 rounded-[3rem] overflow-hidden border-2 shadow-2xl transition-all hover:border-primary/40">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <CardContent className="p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                <div className="relative">
                  <div className="w-28 h-28 rounded-[2.5rem] bg-zinc-950 border-2 border-primary/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-700 animate-icon-flash overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
                    <User className="w-12 h-12 text-primary relative z-10" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-black border-2 border-primary flex items-center justify-center shadow-xl">
                    <Zap className="w-5 h-5 text-primary fill-primary/20" />
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-1">Assinatura de Acesso</p>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                         <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-xl md:text-2xl font-headline font-bold text-white tracking-tight">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="px-5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-900 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3 hover:border-primary/30 transition-all cursor-default">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                      Conta Ativa WS
                    </div>
                    <div className="px-5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-900 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3 hover:border-primary/30 transition-all cursor-default">
                      <ShieldCheck className="w-4 h-4 text-primary animate-icon-flash relative overflow-hidden rounded-sm" />
                      Segurança Blindada
                    </div>
                    <div className="px-5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-900 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3 hover:border-primary/30 transition-all cursor-default">
                      <PawPrint className="w-4 h-4 text-primary" />
                      Protocolo Animal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Histórico Section */}
        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center">
                <History className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-headline font-bold tracking-tight uppercase">
                Linha do Tempo <span className="animate-text-flash italic">Preventiva</span>
              </h3>
            </div>
            <div className="hidden md:block text-[8px] font-black uppercase tracking-[0.4em] text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
              Dados atualizados em tempo real
            </div>
          </div>
          
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-[3.5rem] blur-2xl opacity-10" />
             <div className="relative bg-black p-6 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
                <HistoryList refreshTrigger={0} />
             </div>
          </div>
        </section>

        {/* Footer Info */}
        <div className="text-center pt-20">
          <div className="inline-flex flex-col items-center gap-4 group cursor-default">
            <div className="flex items-center gap-3 opacity-20 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white">
                Criptografia Avançada WS Studios
              </p>
            </div>
            <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-800 px-10">
              Seus dados de saúde animal são protegidos por protocolos de segurança de nível bancário e conformidade integral com a LGPD.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
