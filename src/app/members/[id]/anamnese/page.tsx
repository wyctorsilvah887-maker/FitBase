"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import { 
  ArrowLeft, 
  UserCircle, 
  Phone, 
  Mail, 
  Calendar, 
  Activity, 
  CreditCard, 
  ChevronRight,
  TrendingUp,
  Dumbbell,
  Clock,
  CheckCircle2,
  AlertCircle,
  Scale,
  Ruler,
  HeartPulse,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doc, collection, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function AnamnesisPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const memberRef = useMemoFirebase(() => {
    if (!user || !db || !memberId) return null;
    return doc(db, "users", user.uid, "members", memberId);
  }, [user, db, memberId]);

  const paymentsQuery = useMemoFirebase(() => {
    if (!user || !db || !memberId) return null;
    return query(
      collection(db, "users", user.uid, "payments"),
      where("memberId", "==", memberId),
      orderBy("dueDate", "desc")
    );
  }, [user, db, memberId]);

  const { data: member, isLoading: isMemberLoading } = useDoc(memberRef);
  const { data: payments, isLoading: isPaymentsLoading } = useCollection(paymentsQuery);

  if (isUserLoading || isMemberLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="animate-spin">
          <Dumbbell className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold uppercase tracking-tighter">Aluno não encontrado</h1>
          <Button onClick={() => router.push("/members")} variant="outline" className="rounded-xl uppercase font-black text-[10px] tracking-widest">
            Voltar para Lista
          </Button>
        </main>
      </div>
    );
  }

  const statusConfig: any = {
    ativo: { label: "Ativo", color: "bg-emerald-500/10 text-emerald-600 border-emerald-600/20" },
    inativo: { label: "Inativo", color: "bg-red-500/10 text-red-600 border-red-600/20" },
    pendente: { label: "Pendente", color: "bg-amber-500/10 text-amber-600 border-amber-600/20" },
  };
  const config = statusConfig[member.status] || statusConfig.pendente;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-700">
        
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/members")} 
            className="w-fit h-8 px-0 text-[10px] font-black uppercase tracking-widest gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Voltar para lista
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-primary/5 border-2 border-primary/20 flex items-center justify-center text-primary shrink-0 animate-icon-flash shadow-2xl shadow-primary/5">
                <UserCircle className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <div className="space-y-1">
                <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest border-2 px-3 py-0.5 mb-2 ${config.color}`}>
                  {config.label}
                </Badge>
                <h1 className="text-3xl md:text-5xl font-headline font-bold uppercase tracking-tighter leading-none">
                  {member.name}
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Protocolo de <span className="text-primary italic">Anamnese</span> • FitBase ID: {member.id.slice(-6).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-[2rem] border-2 border-border bg-card p-6 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status Atual</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-xl bg-accent border border-border text-primary group-hover:scale-110 transition-transform">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Peso (kg)</p>
                    <p className="text-sm font-bold">-- kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-xl bg-accent border border-border text-primary group-hover:scale-110 transition-transform">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Altura (cm)</p>
                    <p className="text-sm font-bold">-- cm</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-xl bg-accent border border-border text-primary group-hover:scale-110 transition-transform">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Gordura Corporal</p>
                    <p className="text-sm font-bold">-- %</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-xl h-10 text-[9px] font-black uppercase tracking-widest border-2 hover:bg-primary/10">
                Atualizar Medidas
              </Button>
            </Card>

            <Card className="rounded-[2rem] border-2 border-border bg-card p-6 space-y-4 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Observações</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Utilize este espaço para registrar limitações físicas, lesões prévias ou condições médicas importantes do aluno.
              </p>
              <textarea 
                placeholder="Ex: Aluno possui sensibilidade no joelho esquerdo..."
                className="w-full h-24 bg-background/50 border-2 border-border rounded-xl p-3 text-xs focus:ring-primary outline-none resize-none transition-all"
              />
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="rounded-[1.5rem] border-2 border-border bg-card p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-2">
                     <TrendingUp className="w-4 h-4 text-emerald-500" />
                     <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Histórico de Performance</p>
                  </div>
                  <h4 className="text-xl font-bold uppercase">Evolução Estável</h4>
                  <p className="text-xs text-muted-foreground mt-2">Mantenha as avaliações regulares para gerar gráficos de evolução.</p>
               </Card>
               <Card className="rounded-[1.5rem] border-2 border-border bg-card p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-2">
                     <Clock className="w-4 h-4 text-primary" />
                     <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Frequência Semanal</p>
                  </div>
                  <h4 className="text-xl font-bold uppercase">Membro Frequente</h4>
                  <p className="text-xs text-muted-foreground mt-2">Baseado no status do plano {member.plan}.</p>
               </Card>
            </div>

            <Card className="rounded-[2rem] border-2 border-border bg-card overflow-hidden">
              <div className="p-6 border-b border-border bg-accent/20 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest">Financeiro Vinculado</h3>
                <Link href={`/members/${member.id}`}>
                  <Button variant="ghost" className="h-6 text-[8px] font-black uppercase tracking-widest text-primary hover:bg-primary/10">Ver Detalhes</Button>
                </Link>
              </div>
              <div className="p-2">
                {isPaymentsLoading ? (
                  <div className="p-10 text-center flex justify-center"><Clock className="w-6 h-6 animate-spin text-primary" /></div>
                ) : payments && payments.length > 0 ? (
                  <div className="space-y-1">
                    {payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-transparent group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-primary">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold uppercase">{p.type === 'adesao' ? 'Matrícula' : 'Mensalidade'}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                              {new Date(p.paidAt || p.dueDate).toLocaleDateString('pt-BR')} via {p.paymentMethod?.toUpperCase() || '---'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black tracking-tighter">R$ {(Number(p.amount) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest h-4 px-2 bg-emerald-500/10 text-emerald-600 border-none">
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center flex flex-col items-center gap-4 grayscale opacity-40">
                    <CreditCard className="w-12 h-12 text-muted-foreground" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Nenhum pagamento registrado</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}