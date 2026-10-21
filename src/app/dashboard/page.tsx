"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { 
  CreditCard, 
  Users, 
  AlertCircle,
  Plus,
  ArrowLeft,
  DollarSign,
  Save,
  Check,
  Dumbbell,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, query, orderBy, doc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import Image from "next/image";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [monthlyFeeInput, setMonthlyFeeInput] = useState("0,00");
  const [isSaving, setIsSaving] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);

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
    // Buscando os últimos registros ordenados por data
    return query(collection(db, "users", user.uid, "payments"), orderBy("dueDate", "desc"));
  }, [user, db]);

  const userRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: members } = useCollection(membersQuery);
  const { data: payments } = useCollection(paymentsQuery);
  const { data: userDoc } = useDoc(userRef);

  useEffect(() => {
    if (userDoc?.monthlyFee !== undefined) {
      const value = Number(userDoc.monthlyFee);
      setMonthlyFeeInput(value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [userDoc]);

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const cents = parseInt(digits || "0") / 100;
    return cents.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setMonthlyFeeInput(formatted);
  };

  const handleSaveSettings = () => {
    if (!user || !userRef || isSaving) return;
    setIsSaving(true);
    
    const value = parseFloat(monthlyFeeInput.replace(/\./g, '').replace(',', '.'));
    
    setDocumentNonBlocking(userRef, {
      monthlyFee: isNaN(value) ? 0 : value,
      updatedAt: serverTimestamp()
    }, { merge: true });

    toast({
      title: "Configurações Salvas",
      description: "O valor da mensalidade foi atualizado com sucesso.",
    });

    setTimeout(() => setIsSaving(false), 1000);
  };

  // Cálculo da Receita Mensal
  const monthlyRevenue = payments
    ?.filter(p => {
      if (p.status !== "pago") return false;
      const paymentDate = new Date(p.paidAt || p.dueDate);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && 
             paymentDate.getFullYear() === now.getFullYear();
    })
    .reduce((acc, p) => {
      const val = typeof p.amount === 'number' ? p.amount : parseFloat(p.amount);
      return acc + (isNaN(val) ? 0 : val);
    }, 0) || 0;

  const activeMembers = members?.filter(m => m.status === "ativo").length || 0;
  const pendingPayments = payments?.filter(p => p.status === "pendente").length || 0;

  // Filtragem dos pagamentos visíveis (limite de 5 se não expandido)
  const visiblePayments = showAllRecent ? payments : payments?.slice(0, 5);

  if (!mounted || isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="animate-spin">
          <Dumbbell className="w-12 h-12 text-primary" />
        </div>
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
              Painel <span className="text-primary italic">FitBase</span>
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
            title="Receita Total Mensal" 
            value={`R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
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
                  onChange={handleInputChange}
                  className="h-8 bg-transparent border-none p-0 text-2xl font-headline font-bold tracking-tighter focus-visible:ring-0 w-32"
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
                 {payments && payments.length > 5 && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowAllRecent(!showAllRecent)}
                      className="h-6 text-[8px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 px-2 rounded-lg"
                    >
                      {showAllRecent ? "Ver Menos" : "Ver Todos"}
                    </Button>
                 )}
              </div>
              <div className="space-y-2">
                 {visiblePayments && visiblePayments.length > 0 ? (
                   <>
                     {visiblePayments.map(p => (
                       <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center font-bold text-xs text-primary">{(p.memberName || "AL").slice(0, 2).toUpperCase()}</div>
                             <div>
                                <p className="text-sm font-bold uppercase">{p.memberName}</p>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{new Date(p.dueDate).toLocaleDateString('pt-BR')}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black tracking-tighter">R$ {(Number(p.amount) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                             <p className={`text-[8px] font-black uppercase tracking-widest ${p.status === 'pago' ? 'text-emerald-500' : 'text-amber-500'}`}>{p.status}</p>
                          </div>
                       </div>
                     ))}
                     {!showAllRecent && payments && payments.length > 5 && (
                        <Button 
                          variant="ghost" 
                          onClick={() => setShowAllRecent(true)}
                          className="w-full h-12 rounded-xl border-2 border-dashed border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2"
                        >
                          <ChevronDown className="w-3 h-3" /> Ver mais movimentações
                        </Button>
                     )}
                     {showAllRecent && (
                        <Button 
                          variant="ghost" 
                          onClick={() => setShowAllRecent(false)}
                          className="w-full h-12 rounded-xl text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2"
                        >
                          <ChevronUp className="w-3 h-3" /> Mostrar menos
                        </Button>
                     )}
                   </>
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
                 <p className="text-[8px] text-center font-bold text-muted-foreground uppercase tracking-widest">Digitalização Completa via FitBase</p>
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