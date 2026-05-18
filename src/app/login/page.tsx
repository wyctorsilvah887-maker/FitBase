
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, initiateEmailSignIn, initiateAnonymousSignIn } from '@/firebase';
import Header from '@/components/Header';
import Link from 'next/link';
import { LogIn, Mail, Lock, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonLoading, setIsAnonLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    initiateEmailSignIn(auth, email, password);
    // Reset loading state after a short delay since it's non-blocking
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleAnonymousLogin = () => {
    setIsAnonLoading(true);
    initiateAnonymousSignIn(auth);
    // Reset loading state after a short delay since it's non-blocking
    setTimeout(() => setIsAnonLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-primary selection:text-black">
      <div className="bg-noise" />
      <Header />
      
      <main className="relative z-10 max-w-md mx-auto px-6 pt-12 md:pt-20 pb-20">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-headline font-black tracking-tighter uppercase">Acesso Vet IA</h1>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">Entre ou experimente o protocolo preventivo</p>
          </div>

          <div className="relative group">
            <div className="relative z-10 space-y-6 bg-black p-8 rounded-[2.5rem] border border-primary/30 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none"></div>

              <div className="relative z-10 space-y-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleAnonymousLogin}
                  disabled={isAnonLoading || isLoading}
                  className="w-full h-14 rounded-2xl border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {isAnonLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Continuar como teste</span>
                    </>
                  )}
                </Button>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-zinc-900"></div>
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-700">ou entre com e-mail</span>
                  <div className="flex-1 h-px bg-zinc-900"></div>
                </div>
              </div>

              <form onSubmit={handleLogin} className="relative z-10 space-y-6">
                <div className="space-y-4">
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

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] bg-primary text-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/10"
                    disabled={isLoading || isAnonLoading}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Acessar Conta
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="relative z-10 text-center pt-2">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
                  Novo por aqui? <Link href="/register" className="text-primary hover:underline underline-offset-4">Crie seu perfil</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
