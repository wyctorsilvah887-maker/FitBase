
"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser, initiateEmailSignUp, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/Card";
import { UserPlus, Sparkles, CheckCircle2, Loader2, Dumbbell, DollarSign } from "lucide-react";
import Link from "next/link";
import { doc, serverTimestamp } from "firebase/firestore";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [monthlyFeeInput, setMonthlyFeeInput] = useState("0,00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const cents = parseInt(digits || "0") / 100;
    return cents.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setMonthlyFeeInput(formatted);
  };

  // Redireciona e salva configurações após o cadastro
  useEffect(() => {
    if (user && justSignedUp) {
      const fee = parseFloat(monthlyFeeInput.replace(/\./g, '').replace(',', '.'));
      const settingsRef = doc(db, "users", user.uid, "settings", "config");
      
      setDocumentNonBlocking(settingsRef, {
        monthlyFee: isNaN(fee) ? 0 : fee,
        updatedAt: serverTimestamp()
      }, { merge: true });

      router.push("/members");
    } else if (user) {
      router.push("/members");
    }
  }, [user, justSignedUp, router, db, monthlyFeeInput]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setJustSignedUp(true);
    try {
      initiateEmailSignUp(auth, email, password);
    } finally {
      // O redirecionamento e salvamento ocorrem no useEffect acima ao detectar o usuário
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-body overflow-x-hidden">
      <Header />

      <main className="relative z-10 flex items-center justify-center px-6 py-12 md:py-24">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center animate-icon-flash border-2 border-primary/20">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter">
              Nova <span className="text-primary italic">Academia</span>
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">FitFlow • WS Studios</p>
          </div>

          <Card className="bg-card border-2 border-border rounded-[3rem] overflow-hidden shadow-2xl">
            <CardContent className="p-8 md:p-10 space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">E-mail do Gestor</Label>
                  <Input 
                    type="email" 
                    placeholder="gestor@academia.com" 
                    className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">Crie sua Senha</Label>
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
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">Valor da Mensalidade (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="text"
                      placeholder="0,00" 
                      className="h-12 pl-12 pr-6 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all font-bold"
                      value={monthlyFeeInput}
                      onChange={handleFeeChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Criar Minha Academia <Sparkles className="ml-2 w-4 h-4 text-primary" /></>}
                </Button>
              </form>

              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Vantagens FitFlow:</h4>
                <div className="grid grid-cols-1 gap-3">
                  <BenefitItem text="Fim dos Cadernos de Papel" />
                  <BenefitItem text="Histórico de Alunos em Nuvem" />
                  <BenefitItem text="Controle de Mensalidades" />
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
