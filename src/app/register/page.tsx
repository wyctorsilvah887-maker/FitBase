
"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser, initiateEmailSignUp, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Loader2, Dumbbell, DollarSign, Eye, EyeOff, Building2 } from "lucide-react";
import Link from "next/link";
import { doc, serverTimestamp } from "firebase/firestore";

export default function RegisterPage() {
  const [gymName, setGymName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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

  useEffect(() => {
    if (user && justSignedUp) {
      const fee = parseFloat(monthlyFeeInput.replace(/\./g, '').replace(',', '.'));
      const userRef = doc(db, "users", user.uid);
      
      setDocumentNonBlocking(userRef, {
        gymName: gymName,
        email: user.email,
        monthlyFee: isNaN(fee) ? 0 : fee,
        acceptedTerms: true,
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      router.push("/members");
    } else if (user) {
      router.push("/members");
    }
  }, [user, justSignedUp, router, db, monthlyFeeInput, gymName]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;
    setIsSubmitting(true);
    setJustSignedUp(true);
    initiateEmailSignUp(auth, email, password);
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
              Novo <span className="text-primary italic">Acesso</span>
            </h1>
          </div>

          <Card className="bg-card border-2 border-border rounded-[3rem] overflow-hidden shadow-2xl">
            <CardContent className="p-8 md:p-10 space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">Nome da Academia</Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      placeholder="Ex: FitFlow Academy" 
                      className="h-12 pl-12 pr-6 bg-background border-border rounded-2xl focus:ring-primary border-2 transition-all"
                      value={gymName}
                      onChange={(e) => setGymName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
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
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="No mínimo 6 caracteres" 
                      className="h-12 bg-background border-border rounded-2xl px-6 pr-12 focus:ring-primary border-2 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">Valor da Mensalidade (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="text"
                      placeholder="0,00" 
                      className="h-12 pl-12 pr-6 bg-background border-border rounded-2xl focus:ring-primary border-2 transition-all font-bold"
                      value={monthlyFeeInput}
                      onChange={handleFeeChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-4 px-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className="mt-1 border-2 border-border data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor="terms" className="text-[10px] leading-tight text-muted-foreground font-medium cursor-pointer">
                    Eu li e concordo com os <Link href="/terms" className="text-primary hover:underline italic">Termos de Uso</Link> e políticas de privacidade do FitFlow.
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !acceptedTerms}
                  className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all disabled:opacity-30"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Ativar Sistema FitFlow</>}
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
