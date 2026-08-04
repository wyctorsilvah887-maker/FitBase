
"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser, initiateEmailSignIn, initiateAnonymousSignIn } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Wind, LogIn, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  // Redireciona para o Dashboard assim que o estado do usuário for detectado
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      initiateEmailSignIn(auth, email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    setIsSubmitting(true);
    initiateAnonymousSignIn(auth);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-body overflow-x-hidden">
      <Header />

      <main className="relative z-10 flex items-center justify-center px-6 py-12 md:py-24">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center animate-icon-flash border-2 border-primary/20">
              <Wind className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter">
              Acesso do <span className="text-primary italic">Especialista</span>
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">WS Studios Company</p>
          </div>

          <Card className="bg-card border-2 border-border rounded-[3rem] overflow-hidden shadow-2xl">
            <CardContent className="p-8 md:p-10 space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">E-mail Corporativo</Label>
                  <Input 
                    type="email" 
                    placeholder="tecnico@exemplo.com" 
                    className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">Sua Senha</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/10 hover:scale-[1.02] transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Entrar no Painel <LogIn className="ml-2 w-4 h-4" /></>}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest"><span className="bg-card px-4 text-muted-foreground">Ou continue como</span></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button 
                  variant="outline" 
                  className="h-14 rounded-2xl border-2 border-border font-black uppercase text-[10px] tracking-[0.2em] hover:bg-accent transition-all"
                  onClick={handleGuestLogin}
                  disabled={isSubmitting}
                >
                  <span className="animate-text-flash italic inline-block pr-2">Modo Teste</span> <Sparkles className="ml-2 w-4 h-4 text-primary" />
                </Button>
              </div>

              <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Não possui conta? <Link href="/register" className="text-primary hover:underline italic">Cadastrar Especialista</Link>
              </p>
            </CardContent>
          </Card>

          <div className="text-center flex items-center justify-center gap-4 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest text-foreground">Acesso Criptografado WS Security</span>
          </div>
        </div>
      </main>
    </div>
  );
}
