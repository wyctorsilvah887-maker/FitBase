
"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { 
  DollarSign, 
  ClipboardList, 
  Users, 
  TrendingUp,
  Clock,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, query, orderBy } from "firebase/firestore";
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

  const osQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "serviceOrders"), orderBy("date", "desc"));
  }, [user, db]);

  const { data: allOS, isLoading: loadingStats } = useCollection(osQuery);

  const techsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return collection(db, "users", user.uid, "technicians");
  }, [user, db]);

  const { data: technicians } = useCollection(techsQuery);

  const activeOS = allOS?.filter(os => os.status !== "concluido" && os.status !== "cancelado") || [];
  const totalRevenue = allOS?.reduce((acc, os) => acc + (Number(os.value) || 0), 0) || 0;

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
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-700">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">
            Painel do <span className="text-primary italic">Especialista</span>
          </h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">WS Studios Company • Clima IA</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-[1.5rem] border-2 border-border bg-card/50">
            <CardContent className="p-6 space-y-4">
              <div className="p-2 rounded-xl bg-primary/5 w-fit text-primary"><DollarSign className="w-5 h-5" /></div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Faturamento</p>
                <h3 className="text-2xl font-headline font-bold">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
              </div>
            </CardContent>
          </Card>

          <Link href="/service-orders" className="block group">
            <Card className="rounded-[1.5rem] border-2 border-border bg-card/50 group-hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="p-2 rounded-xl bg-blue-500/10 w-fit text-blue-500"><ClipboardList className="w-5 h-5" /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">OS Ativas</p>
                  <h3 className="text-2xl font-headline font-bold">{activeOS.length}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/technicians" className="block group">
            <Card className="rounded-[1.5rem] border-2 border-border bg-card/50 group-hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="p-2 rounded-xl bg-primary/10 w-fit text-primary"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Técnicos</p>
                  <h3 className="text-2xl font-headline font-bold">{technicians?.length || 0}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="rounded-[1.5rem] border-2 border-border bg-card/50">
            <CardContent className="p-6 space-y-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 w-fit text-emerald-500"><TrendingUp className="w-5 h-5" /></div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Satisfação</p>
                <h3 className="text-2xl font-headline font-bold">98%</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
