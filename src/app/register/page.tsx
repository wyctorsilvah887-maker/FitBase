
"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser, initiateEmailSignUp } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  // Redireciona para o Dashboard assim que o cadastro for detectado
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      initiateEmailSignUp(auth, email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-body overflow-x-hidden">
      <div className="bg-noise" />
      <Header />

      <main className="relative z-10 flex items-center justify-center px-6 py-12 md:py-24">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center animate-icon-flash border-2 border-primary/20">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter">
              Novo <span className="text-primary italic">Especialista</span>
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">WS Studios Company</p>
          </div>

          <Card className="bg-card border-2 border-border rounded-[3rem] overflow-hidden shadow-2xl">
            <CardContent className="p-8 md:p-10 space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">E-mail para Cadastro</Label>
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
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">Defina sua Senha</Label>
                  <Input 
                    type="password" 
                    placeholder="No mínimo 6 caracteres" 
                    className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Criar Conta Técnica <Sparkles className="ml-2 w-4 h-4 text-primary" /></>}
                </Button>
              </form>

              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Vantagens do Especialista:</h4>
                <div className="grid grid-cols-1 gap-3">
                  <BenefitItem text="15 Diagnósticos Diários" />
                  <BenefitItem text="Histórico em Nuvem" />
                  <BenefitItem text="8 Protocolos PMOC/Dia" />
                </div>
              </div>

              <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest pt-4">
                Já possui cadastro? <Link href="/login" className="text-primary hover:underline italic">Entrar agora</Link>
              </p>
            </CardContent>
          </Card>

          <div className="text-center opacity-50">
             <p className="text-[8px] font-bold uppercase tracking-widest">
                Ao se cadastrar, você concorda com nossos <Link href="/terms" className="underline">Termos de Uso</Link>
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
      <span className="text-[10px] font-bold uppercase tracking-tight text-foreground/70">{text}</span>
    </div>
  );
}
