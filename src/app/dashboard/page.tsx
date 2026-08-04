
"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ClipboardList, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  CalendarCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import Link from "next/link";

const MOCK_FINANCIAL_DATA = [
  { month: "Jan", receita: 4500, despesa: 2100 },
  { month: "Fev", receita: 5200, despesa: 2400 },
  { month: "Mar", receita: 4800, despesa: 2200 },
  { month: "Abr", receita: 6100, despesa: 2800 },
  { month: "Mai", receita: 5900, despesa: 2600 },
  { month: "Jun", receita: 7200, despesa: 3100 },
];

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

  // Busca todas as OS para estatísticas
  const allOSQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "serviceOrders"), orderBy("date", "desc"));
  }, [user, db]);

  const { data: allOS, isLoading: loadingStats } = useCollection(allOSQuery);

  // Cálculos dinâmicos baseados no Firestore
  const activeOS = allOS?.filter(os => os.status !== "concluido" && os.status !== "cancelado") || [];
  const pendingOS = allOS?.filter(os => os.status === "pendente") || [];
  const inProgressOS = allOS?.filter(os => os.status === "em_andamento") || [];
  const completedOS = allOS?.filter(os => os.status === "concluido") || [];
  
  const totalRevenue = allOS?.reduce((acc, os) => acc + (os.value || 0), 0) || 0;

  const osStatusData = [
    { name: "Pendente", value: pendingOS.length, color: "#f59e0b" },
    { name: "Em Andamento", value: inProgressOS.length, color: "#3b82f6" },
    { name: "Concluído", value: completedOS.length, color: "#10b981" },
  ];

  if (!mounted || isUserLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Clock className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground font-body">
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">
              Painel do <span className="text-primary italic">Especialista</span>
            </h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              WS Studios Company • Gestão Técnica & Financeira
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/service-orders">
              <Button className="rounded-xl text-[9px] font-black uppercase tracking-widest h-10 px-6 shadow-lg shadow-primary/20">
                Nova Ordem de Serviço +
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Receita Total" 
            value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            trend="+0%" 
            icon={<DollarSign className="w-5 h-5" />} 
            color="text-emerald-500" 
          />
          <Link href="/service-orders" className="block">
            <StatsCard 
              title="OS Ativas" 
              value={activeOS.length.toString()} 
              trend={loadingStats ? "..." : `+${activeOS.length}`} 
              icon={<ClipboardList className="w-5 h-5" />} 
              color="text-blue-500" 
              isClickable
            />
          </Link>
          <StatsCard 
            title="Manutenções Pendentes" 
            value={pendingOS.length.toString()} 
            trend={pendingOS.length > 0 ? "⚠️" : "✓"} 
            icon={<Wrench className="w-5 h-5" />} 
            color="text-amber-500" 
          />
          <StatsCard 
            title="Satisfação" 
            value="98%" 
            trend="+1.2%" 
            icon={<TrendingUp className="w-5 h-5" />} 
            color="text-primary" 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-[2rem] border-2 border-border bg-card/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> Fluxo Financeiro (BRL)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_FINANCIAL_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold" }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "1rem", border: "2px solid #e2e8f0", backgroundColor: "white" }}
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  />
                  <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="despesa" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-2 border-border bg-card/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> Status das OS
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={osStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {osStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
            <div className="px-6 pb-6 space-y-2">
              {osStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </div>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Management & Recent OS Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-[2rem] border-2 border-border bg-card/50 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-primary" /> Ordens Recentes
                </CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase tracking-widest mt-1">Últimos atendimentos técnicos</CardDescription>
              </div>
              <Link href="/service-orders">
                <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest">Ver Tudo</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-[8px] font-black uppercase tracking-widest">Cliente</TableHead>
                    <TableHead className="text-[8px] font-black uppercase tracking-widest">Equipamento</TableHead>
                    <TableHead className="text-[8px] font-black uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-[8px] font-black uppercase tracking-widest text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allOS && allOS.length > 0 ? (
                    allOS.slice(0, 5).map((os) => (
                      <DashboardTableRow 
                        key={os.id}
                        client={os.customerName} 
                        equip={`${os.equipment} ${os.btus}`} 
                        status={os.status} 
                        value={`R$ ${os.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-[10px] font-bold text-muted-foreground uppercase">
                        {loadingStats ? "Carregando Ordens..." : "Nenhuma ordem encontrada"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-2 border-border bg-card/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Metas da Equipe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <GoalItem label="Higienizações (Mês)" current={completedOS.length} total={20} color="bg-primary" />
              <GoalItem label="Instalações" current={inProgressOS.length} total={10} color="bg-blue-500" />
              <GoalItem label="Faturamento OS" current={totalRevenue} total={15000} color="bg-emerald-500" isCurrency />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function StatsCard({ title, value, trend, icon, color, isClickable }: { title: string, value: string, trend: string, icon: any, color: string, isClickable?: boolean }) {
  return (
    <Card className={`rounded-[1.5rem] border-2 border-border bg-card/50 hover:border-primary/30 transition-all group ${isClickable ? 'cursor-pointer hover:shadow-lg hover:shadow-primary/5' : ''}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">{icon}</div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${color}`}>{trend}</span>
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-headline font-bold tracking-tight">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardTableRow({ client, equip, status, value }: { client: string, equip: string, status: string, value: string }) {
  const statusConfig: any = {
    pendente: { label: "Pendente", color: "bg-amber-500/10 text-amber-600 border-amber-600/20" },
    em_andamento: { label: "Em Andamento", color: "bg-blue-500/10 text-blue-600 border-blue-600/20" },
    concluido: { label: "Concluído", color: "bg-emerald-500/10 text-emerald-600 border-emerald-600/20" },
    cancelado: { label: "Cancelado", color: "bg-red-500/10 text-red-600 border-red-600/20" },
  };

  const config = statusConfig[status] || statusConfig.pendente;

  return (
    <TableRow className="border-border hover:bg-accent/20">
      <TableCell className="text-[10px] font-bold">{client}</TableCell>
      <TableCell className="text-[10px] text-muted-foreground">{equip}</TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest border-2 ${config.color}`}>
          {config.label}
        </Badge>
      </TableCell>
      <TableCell className="text-[10px] font-black text-right">{value}</TableCell>
    </TableRow>
  );
}

function GoalItem({ label, current, total, color, isCurrency }: { label: string, current: number, total: number, color: string, isCurrency?: boolean }) {
  const progress = Math.min((current / total) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
        <span>{label}</span>
        <span>{isCurrency ? `R$ ${current.toLocaleString('pt-BR')}` : current} / {isCurrency ? `R$ ${total.toLocaleString('pt-BR')}` : total}</span>
      </div>
      <Progress value={progress} className={`h-2 rounded-full bg-accent ${color}`} />
    </div>
  );
}
