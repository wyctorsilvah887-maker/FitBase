
"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { 
  Plus, 
  ArrowLeft, 
  Search, 
  UserCog, 
  Phone, 
  Mail, 
  Wrench,
  BadgeCheck,
  MoreVertical,
  ShieldCheck,
  UserPlus,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { collection, query, orderBy } from "firebase/firestore";
import { NewTechnicianModal } from "@/components/NewTechnicianModal";
import { TechnicianScheduleModal } from "@/components/TechnicianScheduleModal";

export default function TechniciansPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewTechModalOpen, setIsNewTechModalOpen] = useState(false);
  const [selectedTechForSchedule, setSelectedTechForSchedule] = useState<any | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const techsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "technicians"), orderBy("name", "asc"));
  }, [user, db]);

  const { data: technicians, isLoading } = useCollection(techsQuery);

  const filteredTechs = technicians?.filter(tech => 
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Wrench className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground font-body">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/dashboard")} 
              className="mb-2 -ml-2 h-8 text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-accent"
            >
              <ArrowLeft className="w-3 h-3" /> Painel Técnico
            </Button>
            <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">
              Gestão de <span className="text-primary italic">Técnicos</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Equipe especializada WS Studios Company
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Pesquisar técnico..." 
                  className="pl-11 h-11 w-full sm:w-64 bg-card border-border rounded-2xl border-2 focus-visible:ring-primary transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button 
                onClick={() => setIsNewTechModalOpen(true)}
                className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/10 hover:scale-105 transition-all"
              >
                <UserPlus className="w-4 h-4 mr-2" /> Novo Técnico
             </Button>
          </div>
        </div>

        {/* Technicians Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="rounded-[2.5rem] border-2 border-border bg-card/50 h-64 animate-pulse" />
            ))
          ) : filteredTechs.length > 0 ? (
            filteredTechs.map((tech) => (
              <TechnicianCard 
                key={tech.id} 
                tech={tech} 
                onViewSchedule={() => setSelectedTechForSchedule(tech)} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4 bg-card/30 rounded-[3rem] border-2 border-dashed border-border">
              <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center">
                <UserCog className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Nenhum técnico cadastrado</p>
              <Button 
                variant="outline" 
                onClick={() => setIsNewTechModalOpen(true)}
                className="rounded-xl text-[9px] font-black uppercase tracking-widest h-10 px-6 border-2"
              >
                Cadastrar Colaborador
              </Button>
            </div>
          )}
        </div>
      </main>

      <NewTechnicianModal isOpen={isNewTechModalOpen} onClose={() => setIsNewTechModalOpen(false)} />
      <TechnicianScheduleModal 
        technician={selectedTechForSchedule} 
        isOpen={!!selectedTechForSchedule} 
        onClose={() => setSelectedTechForSchedule(null)} 
      />
    </div>
  );
}

function TechnicianCard({ tech, onViewSchedule }: { tech: any, onViewSchedule: () => void }) {
  const statusConfig: any = {
    ativo: { label: "Disponível", color: "bg-emerald-500/10 text-emerald-600 border-emerald-600/20" },
    inativo: { label: "Indisponível", color: "bg-red-500/10 text-red-600 border-red-600/20" },
  };

  const config = statusConfig[tech.status] || statusConfig.ativo;

  return (
    <Card className="rounded-[2.5rem] border-2 border-border bg-card hover:border-primary/30 transition-all group overflow-hidden relative">
      <div className="absolute top-6 right-6 flex gap-2">
         <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest border-2 px-3 py-1 ${config.color}`}>
            {config.label}
          </Badge>
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-accent -mr-2">
            <MoreVertical className="w-4 h-4" />
          </Button>
      </div>

      <CardContent className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 border-2 border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-500">
             <UserCog className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-headline font-bold uppercase tracking-tight">{tech.name}</h3>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
              <BadgeCheck className="w-3 h-3" /> {tech.specialty || "Especialista HVAC"}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            <Phone className="w-3.5 h-3.5 text-primary" /> <span>{tech.phone || "Telefone não informado"}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            <Mail className="w-3.5 h-3.5 text-primary" /> <span>{tech.email || "Email não informado"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Credenciado WS</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={onViewSchedule}
            className="text-[9px] font-black uppercase tracking-widest h-10 hover:text-primary gap-2"
          >
            <Calendar className="w-3.5 h-3.5" /> Ver Escala
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
