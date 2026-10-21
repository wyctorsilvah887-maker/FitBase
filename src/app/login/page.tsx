"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser, initiateEmailSignIn, initiateAnonymousSignIn } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, Sparkles, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/members");
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
          <div className="text-center space-y-6">
            <div className="mx-auto flex items-center justify-center animate-icon-flash">
              <Image src="/logo fitbase.png" alt="FitBase" width={110} height={110} className="object-contain" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter">
                Acesso do <span className="text-primary italic">Gestor</span>
              </h1>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">FitBase • Central de Gestão</p>
            </div>
          </div>

          <Card className="bg-card border-2 border-border rounded-[3rem] overflow-hidden shadow-2xl">
            <CardContent className="p-8 md:p-10 space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">E-mail Cadastrado</Label>
                  <Input 
                    type="email" 
                    placeholder="exemplo@fitbase.com" 
                    className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-3">Senha</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="h-12 bg-background border-border rounded-2xl px-6 pr-12 focus:ring-primary border-2 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/10 hover:scale-[1.02] transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Entrar no Sistema <LogIn className="ml-2 w-4 h-4" /></>}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest"><span className="bg-card px-4 text-muted-foreground">Ou continue com</span></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button 
                  variant="outline" 
                  className="h-14 rounded-2xl border-2 border-border font-black uppercase text-[10px] tracking-[0.2em] hover:bg-accent transition-all"
                  onClick={handleGuestLogin}
                  disabled={isSubmitting}
                >
                  <span className="italic inline-block pr-2">Modo Demonstração</span> <Sparkles className="ml-2 w-4 h-4 text-primary" />
                </Button>
              </div>

              <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Não possui acesso? <Link href="/register" className="text-primary hover:underline italic">Cadastrar Novo Acesso</Link>
              </p>
            </CardContent>
          </Card>

          <div className="text-center flex items-center justify-center gap-4 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest text-foreground">Acesso Seguro FitBase</span>
          </div>
        </div>
      </main>
    </div>
  );
}
