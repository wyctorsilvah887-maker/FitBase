
"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { 
  CreditCard, 
  Users, 
  TrendingUp,
  Clock,
  Dumbbell,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { collection, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

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
    return query(collection(db, "users", user.uid, "payments"), orderBy("dueDate", "desc"), limit(50));
  }, [user, db]);

  const { data: members } = useCollection(membersQuery);
  const { data: payments } = useCollection(paymentsQuery);

  const activeMembers = members?.filter(m => m.status === "ativo").length || 0;
  const pendingPayments = payments?.filter(p => p.status === "pendente").length || 0;
  const totalRevenue = payments?.filter(p => p.status === "pago").reduce((acc, p) => acc + (Number(p.amount) || 0), 0) || 0;

  if (!mounted || isUserLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Dumbbell className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground font-body">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-700">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter">
            Painel de <span className="text-primary italic">Gestão</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">WS Studios • FitFlow IA Control</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Receita Total" 
            value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            icon={<CreditCard className="w-5 h-5" />} 
            color="text-emerald-500" 
          />
          <StatCard 
            title="Alunos Ativos" 
            value={activeMembers.toString()} 
            icon={<Users className="w-5 h-5" />} 
            color="text-blue-500" 
            link="/members"
          />
          <StatCard 
            title="Pendências" 
            value={pendingPayments.toString()} 
            icon={<AlertCircle className="w-5 h-5" />} 
            color="text-amber-500" 
            link="/payments"
          />
          <StatCard 
            title="Taxa Retenção" 
            value="94%" 
            icon={<TrendingUp className="w-5 h-5" />} 
            color="text-primary" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 rounded-[3rem] border-2 border-border bg-card/30 p-8 space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Últimos Pagamentos</h3>
                 <Link href="/payments" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">Ver Todos</Link>
              </div>
              <div className="space-y-4">
                 {payments?.slice(0, 5).map(p => (
                   <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-bold text-xs uppercase">{p.memberName.slice(0, 2)}</div>
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
                 ))}
                 {(!payments || payments.length === 0) && (
                   <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-2 border-dashed border-border rounded-[2rem]">
                      Aguardando novos registros digitais
                   </div>
                 )}
              </div>
           </Card>

           <Card className="rounded-[3rem] border-2 border-border bg-primary p-8 text-white flex flex-col justify-between">
              <div className="space-y-2">
                 <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70">IA Insights</h3>
                 <p className="text-2xl font-headline font-bold leading-none tracking-tighter uppercase">Potencial de Crescimento</p>
              </div>
              <div className="space-y-6">
                 <p className="text-sm font-medium opacity-90 leading-relaxed">
                    Com base nos dados digitalizados, sua academia pode crescer 15% nos próximos 3 meses apenas otimizando as cobranças atrasadas.
                 </p>
                 <Button className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white/90">
                    Gerar Relatório Completo <ArrowUpRight className="ml-2 w-4 h-4" />
                 </Button>
              </div>
           </Card>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color, link }: { title: string, value: string, icon: any, color: string, link?: string }) {
  const content = (
    <Card className={`rounded-[2rem] border-2 border-border bg-card/50 transition-all ${link ? 'hover:border-primary/50' : ''}`}>
      <CardContent className="p-8 space-y-4">
        <div className={`p-3 rounded-2xl bg-card border border-border w-fit ${color}`}>{icon}</div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-headline font-bold tracking-tighter">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );

  if (link) return <Link href={link}>{content}</Link>;
  return content;
}
