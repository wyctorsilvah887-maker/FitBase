
"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Plus, ArrowLeft, Search, Wrench, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, query, orderBy } from "firebase/firestore";
import { NewOSModal } from "@/components/NewOSModal";
import { Badge } from "@/components/ui/badge";

export default function ServiceOrdersPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const filteredOS = serviceOrders?.filter(os => 
    os.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    os.equipment.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isUserLoading || !user) {
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-2 -ml-2 h-8 text-[9px] font-black uppercase tracking-widest gap-2">
              <ArrowLeft className="w-3 h-3" /> Painel
            </Button>
            <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">Ordens de <span className="text-primary italic">Serviço</span></h1>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar..." 
                className="pl-11 h-11 bg-card border-border rounded-2xl border-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="h-11 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest">
              <Plus className="w-4 h-4 mr-2" /> Nova OS
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
             <div className="col-span-full text-center py-20 text-muted-foreground uppercase font-black tracking-widest">Sincronizando Dados...</div>
          ) : filteredOS.length > 0 ? (
            filteredOS.map((os) => (
              <Card key={os.id} className="rounded-[2.5rem] border-2 border-border bg-card p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-2 border-primary/20 text-primary">
                    {os.status.replace('_', ' ')}
                  </Badge>
                  <p className="text-[10px] font-bold text-muted-foreground">{new Date(os.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-headline font-bold uppercase">{os.customerName}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Wrench className="w-3 h-3 text-primary" /> {os.equipment} • {os.btus} BTUs
                  </p>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-xl font-headline font-bold">R$ {Number(os.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest">Gerenciar</Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-card/30 rounded-[3rem] border-2 border-dashed border-border text-muted-foreground uppercase font-black tracking-widest">
              Nenhuma OS encontrada
            </div>
          )}
        </div>
      </main>
      <NewOSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
