
"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { 
  Plus, 
  ArrowLeft, 
  Search, 
  Filter, 
  MoreVertical, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, query, orderBy, where } from "firebase/firestore";

export default function ServiceOrdersPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const osQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "serviceOrders"), orderBy("date", "desc"));
  }, [user, db]);

  const { data: serviceOrders, isLoading } = useCollection(osQuery);

  const activeOS = serviceOrders?.filter(os => os.status !== "concluido" && os.status !== "cancelado") || [];

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Clock className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              onClick={() => router.back()} 
              className="mb-2 -ml-2 h-8 text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-accent"
            >
              <ArrowLeft className="w-3 h-3" /> Voltar ao Painel
            </Button>
            <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">
              Ordens de <span className="text-primary italic">Serviço</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Gerenciamento de atendimentos técnicos ativos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Pesquisar OS ou Cliente..." 
                  className="pl-11 h-11 w-full sm:w-64 bg-card border-border rounded-2xl border-2 focus-visible:ring-primary transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/10">
                <Plus className="w-4 h-4 mr-2" /> Nova OS
             </Button>
          </div>
        </div>

        {/* Active OS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="rounded-[2.5rem] border-2 border-border bg-card/50 h-64 animate-pulse" />
            ))
          ) : activeOS.length > 0 ? (
            activeOS.map((os) => (
              <OSCard key={os.id} os={os} />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4 bg-card/30 rounded-[3rem] border-2 border-dashed border-border">
              <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center">
                <Wrench className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Nenhuma OS ativa no momento</p>
              <Button variant="outline" className="rounded-xl text-[9px] font-black uppercase tracking-widest h-10 px-6 border-2">Criar Primeira OS</Button>
            </div>
          )}
        </div>

        {/* OS History / Full List Table */}
        <Card className="rounded-[2.5rem] border-2 border-border bg-card/50 overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Histórico Geral
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest">
                <Filter className="w-3 h-3 mr-2" /> Filtrar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="px-8 text-[8px] font-black uppercase tracking-widest">ID / Data</TableHead>
                  <TableHead className="text-[8px] font-black uppercase tracking-widest">Cliente</TableHead>
                  <TableHead className="text-[8px] font-black uppercase tracking-widest">Equipamento</TableHead>
                  <TableHead className="text-[8px] font-black uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-[8px] font-black uppercase tracking-widest text-right pr-8">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceOrders && serviceOrders.length > 0 ? (
                  serviceOrders.map((os) => (
                    <OSTableRow key={os.id} os={os} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Sem dados de histórico disponíveis
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function OSCard({ os }: { os: any }) {
  const statusConfig: any = {
    pendente: { label: "Pendente", color: "bg-amber-500/10 text-amber-600 border-amber-600/20", icon: <Clock className="w-3 h-3" /> },
    em_andamento: { label: "Executando", color: "bg-blue-500/10 text-blue-600 border-blue-600/20", icon: <Wrench className="w-3 h-3" /> },
  };

  const config = statusConfig[os.status] || statusConfig.pendente;

  return (
    <Card className="rounded-[2.5rem] border-2 border-border bg-card hover:border-primary/30 transition-all group overflow-hidden">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-[0.2em] border-2 px-3 py-1 gap-2 ${config.color}`}>
            {config.icon} {config.label}
          </Badge>
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-accent">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-headline font-bold uppercase tracking-tight">{os.customerName}</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Wrench className="w-3 h-3 text-primary" /> {os.equipment} • {os.btus}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" /> <span>Endereço não informado</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground">
            <Phone className="w-3.5 h-3.5" /> <span>(11) 98888-7777</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Valor do Serviço</p>
            <p className="text-xl font-headline font-bold text-foreground">R$ {os.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <Button className="rounded-xl bg-accent text-foreground hover:bg-primary hover:text-white transition-all text-[9px] font-black uppercase tracking-widest h-10 px-5">
            Gerenciar OS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OSTableRow({ os }: { os: any }) {
  const statusConfig: any = {
    pendente: { label: "Pendente", color: "bg-amber-500/10 text-amber-600 border-amber-600/20" },
    em_andamento: { label: "Em Andamento", color: "bg-blue-500/10 text-blue-600 border-blue-600/20" },
    concluido: { label: "Concluído", color: "bg-emerald-500/10 text-emerald-600 border-emerald-600/20" },
    cancelado: { label: "Cancelado", color: "bg-red-500/10 text-red-600 border-red-600/20" },
  };

  const config = statusConfig[os.status] || statusConfig.pendente;

  return (
    <TableRow className="border-border hover:bg-accent/10">
      <TableCell className="px-8 py-4">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-foreground">#OS-{os.id.substring(0, 4).toUpperCase()}</p>
          <p className="text-[9px] font-medium text-muted-foreground">{new Date(os.date).toLocaleDateString('pt-BR')}</p>
        </div>
      </TableCell>
      <TableCell className="text-[11px] font-bold">{os.customerName}</TableCell>
      <TableCell className="text-[11px] text-muted-foreground">{os.equipment}</TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest border-2 ${config.color}`}>
          {config.label}
        </Badge>
      </TableCell>
      <TableCell className="text-[11px] font-black text-right pr-8">
        R$ {os.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </TableCell>
    </TableRow>
  );
}
