"use client";

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { HistoryList } from '@/components/HistoryList';
import { History, User, Mail, ShieldCheck, PawPrint, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
          <PawPrint className="w-8 h-8 text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Carregando Perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-primary selection:text-black">
      <div className="bg-noise" />
      <Header />
      
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24 space-y-16">
        {/* User Info Header */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-primary mb-2">
                <User className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Perfil do Tutor</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-tighter uppercase leading-none">
                Olá, <span className="text-primary italic">Bem-vindo</span>
              </h1>
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">{currentDate}</p>
            </div>
          </div>

          <Card className="bg-black border-zinc-800 rounded-[2.5rem] overflow-hidden border-2">
            <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">E-mail de Acesso</p>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-lg font-bold text-white">{user.email}</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <div className="px-3 py-1.5 rounded-full bg-black border border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    Conta Verificada
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-black border border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-primary" />
                    Membro WS Studios
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Histórico Section */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="flex items-center gap-3 px-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-headline font-bold tracking-tight uppercase">Seu Histórico de Prevenção</h3>
          </div>
          
          <div className="bg-black p-4 md:p-8 rounded-[3rem] border border-white/5 shadow-2xl">
            <HistoryList refreshTrigger={0} />
          </div>
        </section>

        {/* Footer Info */}
        <div className="text-center pt-10 opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-500">
            Dados protegidos por criptografia WS Studios • LGPD Compliant
          </p>
        </div>
      </main>
    </div>
  );
}
