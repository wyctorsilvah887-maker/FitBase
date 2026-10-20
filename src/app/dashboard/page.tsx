
"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc, setDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { 
  CreditCard, 
  Users, 
  Dumbbell,
  AlertCircle,
  Plus,
  ArrowLeft,
  DollarSign,
  Save,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [monthlyFeeInput, setMonthlyFeeInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const membersQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return collection(db, "users", user.uid, "members");
  }, [user, db]);

  const paymentsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "payments"), orderBy("dueDate", "desc"), limit(10));
  }, [user, db]);

  const settingsRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid, "settings", "config");
  }, [user, db]);

  const { data: members } = useCollection(membersQuery);
  const { data: payments } = useCollection(paymentsQuery);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (settings?.monthlyFee) {
      setMonthlyFeeInput(settings.monthlyFee.toString());
    }
  }, [settings]);

  const handleSaveSettings = () => {
    if (!user || !settingsRef || isSaving) return;
    setIsSaving(true);
    
    const value = parseFloat(monthlyFeeInput.replace(',', '.'));
    
    setDocumentNonBlocking(settingsRef, {
      monthlyFee: value || 0,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    toast({
      title: "Configurações Salvas",
      description: "O valor da mensalidade foi atualizado com sucesso.",
    });

    setTimeout(() => setIsSaving(false), 1000);
  };

  const activeMembers = members?.filter(m => m.status === "ativo").length || 0;
  const pendingPayments = payments?.filter(p => p.status === "pendente").length || 0;
  const totalRevenue = payments?.filter(p => p.status === "pago").reduce((acc, p) => acc + (Number(p.amount) || 0), 0) || 0;

  if (!mounted || isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Dumbbell className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-700">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">
              Painel <span className="text-primary italic">FitFlow</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Controle Geral • Digital Smart Gym</p>
          </div>
          <div className="flex gap-2">
            <Link href="/members">
              <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest border border-border hover:bg-accent">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Receita Acumulada" 
            value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            icon={<CreditCard className="w-4 h-4" />} 
            color="text-emerald-500" 
          />
          <StatCard 
            title="Alunos Ativos" 
            value={activeMembers.toString()} 
            icon={<Users className="w-4 h-4" />} 
            color="text-blue-500" 
          />
          <StatCard 
            title="Pendências" 
            value={pendingPayments.toString()} 
            icon={<AlertCircle className="w-4 h-4" />} 
            color="text-amber-500" 
          />
          
          <Card className="rounded-[1.5rem] border-2 border-border bg-card p-6 space-y-3 transition-all hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-accent border border-border w-fit text-primary">
                <DollarSign className="w-4 h-4" />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="h-7 px-2 rounded-lg text-[8px] font-black uppercase tracking-widest bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20"
              >
                {isSaving ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3 mr-1" />}
                {isSaving ? "OK" : "Salvar"}
              </Button>
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">Valor Mensalidade</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xl font-headline font-bold tracking-tighter">R$</span>
                <Input 
                  type="text"
                  value={monthlyFeeInput}
                  onChange={(e) => setMonthlyFeeInput(e.target.value)}
                  className="h-8 bg-transparent border-none p-0 text-2xl font-headline font-bold tracking-tighter focus-visible:ring-0 w-24"
                  placeholder="0,00"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card className="lg:col-span-2 rounded-[2rem] border-2 border-border bg-card p-6 space-y-6">
              <div className="flex justify-between items-center px-2">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Movimentações Recentes</h3>
              </div>
              <div className="space-y-2">
                 {payments && payments.length > 0 ? (
                   payments.map(p => (
                     <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center font-bold text-xs text-primary">{(p.memberName || "AL").slice(0, 2).toUpperCase()}</div>
                           <div>
                              <p className="text-sm font-bold uppercase">{p.memberName}</p>
                              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{new Date(p.dueDate).toLocaleDateString('pt-BR')}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black tracking-tighter">R$ {p.amount.toFixed(2)}</p>
                           <p className={`text-[8px] font-black uppercase tracking-widest ${p.status === 'pago' ? 'text-emerald-500' : 'text-amber-500'}`}>{p.status}</p>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="py-20 text-center flex flex-col items-center gap-3 bg-accent/20 border-2 border-dashed border-border rounded-2xl">
                      <div className="p-3 bg-card rounded-full"><Plus className="w-6 h-6 text-muted-foreground/50" /></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Sem registros para exibir</p>
                   </div>
                 )}
              </div>
           </Card>

           <Card className="rounded-[2rem] border-2 border-border bg-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Resumo da Digitalização</h3>
                 <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 space-y-3">
                    <p className="text-sm font-bold uppercase tracking-tight text-primary">Controle Financeiro</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                       {pendingPayments > 0 
                        ? `Você possui ${pendingPayments} pendências registradas. Mantenha sua lista de alunos atualizada.`
                        : "Excelente! Não há pendências registradas para o período."
                       }
                    </p>
                 </div>
              </div>
              
              <div className="space-y-2">
                 <Link href="/members" className="w-full">
                   <Button className="w-full h-12 rounded-xl bg-foreground text-background font-black uppercase tracking-widest text-[9px] hover:scale-[1.02] transition-transform">
                      Gerenciar Matrículas <ArrowLeft className="ml-2 w-3 h-3 text-primary rotate-180" />
                   </Button>
                 </Link>
                 <p className="text-[8px] text-center font-bold text-muted-foreground uppercase tracking-widest">Digitalização Completa via FitFlow</p>
              </div>
           </Card>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: any, color: string }) {
  return (
    <Card className="rounded-[1.5rem] border-2 border-border bg-card p-6 space-y-3 transition-all hover:border-primary/20">
      <div className={`p-2 rounded-lg bg-accent border border-border w-fit ${color}`}>{icon}</div>
      <div>
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-headline font-bold tracking-tighter">{value}</h3>
      </div>
    </Card>
  );
}
