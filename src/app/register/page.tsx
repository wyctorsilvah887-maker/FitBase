'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, initiateEmailSignUp } from '@/firebase';
import Header from '@/components/Header';
import Link from 'next/link';
import { UserPlus, Mail, Lock, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      initiateEmailSignUp(auth, email, password);
      router.push('/');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-primary selection:text-black">
      <div className="bg-noise" />
      <Header />
      
      <main className="relative z-10 max-w-md mx-auto px-6 pt-12 md:pt-20">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-headline font-black tracking-tighter uppercase">Criar conta</h1>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">Junte-se à WS Studios e cuide melhor do seu pet</p>
          </div>

          <div className="relative group">
            {/* Card com Estilo Premium & Gradiente Verde */}
            <form 
              onSubmit={handleRegister} 
              className="relative z-10 space-y-6 bg-black p-8 rounded-[2.5rem] border border-primary/30 shadow-2xl overflow-hidden"
            >
              {/* Gradiente Verde Estático */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none"></div>

              <div className="relative z-10 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-2">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl pl-12 focus:ring-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-2">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl pl-12 focus:ring-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] bg-primary text-black hover:bg-primary/90 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Cadastrar
                    </>
                  )}
                </Button>
              </div>

              <div className="relative z-10 text-center pt-2">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
                  Já tem conta? <Link href="/login" className="text-primary hover:underline underline-offset-4">Faça login aqui</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
