"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { 
  Plus, 
  Search, 
  UserPlus, 
  Phone, 
  Calendar,
  MoreVertical,
  RefreshCcw,
  CreditCard,
  Edit2,
  Trash2,
  UserCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { NewMemberModal } from "@/components/NewMemberModal";
import { RenewPlanModal } from "@/components/RenewPlanModal";
import { useToast } from "@/hooks/use-toast";

export default function MembersPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [renewingMember, setRenewingMember] = useState<any | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const membersQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "members"), orderBy("name", "asc"));
  }, [user, db]);

  const { data: members, isLoading } = useCollection(membersQuery);

  const filteredMembers = members?.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  ) || [];

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <UserPlus className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">
              Alunos <span className="text-primary italic">Matriculados</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Controle de acesso e planos • FitFlow
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Pesquisar aluno..." 
                  className="pl-11 h-11 w-full sm:w-64 bg-card border-border rounded-2xl border-2 focus-visible:ring-primary transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button 
                onClick={() => setIsNewMemberModalOpen(true)}
                className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/10 hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" /> Novo Aluno
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="rounded-[2.5rem] border-2 border-border bg-card/50 h-48 animate-pulse" />
            ))
          ) : filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <MemberCard 
                key={member.id} 
                member={member} 
                userId={user.uid} 
                onRenew={() => setRenewingMember(member)}
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4 bg-accent/20 rounded-[3rem] border-2 border-dashed border-border">
              <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Nenhum aluno cadastrado</p>
              <Button 
                variant="outline" 
                onClick={() => setIsNewMemberModalOpen(true)}
                className="rounded-xl text-[9px] font-black uppercase tracking-widest h-10 px-6 border-2"
              >
                Cadastrar Primeiro Aluno
              </Button>
            </div>
          )}
        </div>
      </main>

      <NewMemberModal isOpen={isNewMemberModalOpen} onClose={() => setIsNewMemberModalOpen(false)} />
      <RenewPlanModal 
        isOpen={!!renewingMember} 
        onClose={() => setRenewingMember(null)} 
        member={renewingMember}
      />
    </div>
  );
}

function MemberCard({ member, userId, onRenew }: { member: any, userId: string, onRenew: () => void }) {
  const db = useFirestore();
  const { toast } = useToast();
  
  const statusConfig: any = {
    ativo: { label: "Ativo", color: "bg-emerald-500/10 text-emerald-600 border-emerald-600/20" },
    inativo: { label: "Inativo", color: "bg-red-500/10 text-red-600 border-red-600/20" },
    pendente: { label: "Pendente", color: "bg-amber-500/10 text-amber-600 border-amber-600/20" },
  };

  const config = statusConfig[member.status] || statusConfig.pendente;

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja remover ${member.name}?`)) {
      const memberRef = doc(db, "users", userId, "members", member.id);
      deleteDocumentNonBlocking(memberRef);
      toast({
        title: "Aluno removido",
        description: "Os dados do aluno foram excluídos com sucesso.",
      });
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-2 border-border bg-card hover:border-primary/30 transition-all group overflow-hidden relative">
      <div className="absolute top-6 right-6 flex gap-2 items-center">
         <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest border-2 px-3 py-1 ${config.color}`}>
            {config.label}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-accent -mr-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] border-2 border-border p-2">
              <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-3 py-2">
                Gestão do Aluno
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onRenew}
                className="rounded-xl flex items-center gap-3 py-2.5 px-3 cursor-pointer focus:bg-primary/10 group"
              >
                <RefreshCcw className="w-4 h-4 text-primary group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[11px] font-bold uppercase tracking-tight">Renovação de Plano</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl flex items-center gap-3 py-2.5 px-3 cursor-pointer focus:bg-primary/10">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-tight">Pagamento Adiantado</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl flex items-center gap-3 py-2.5 px-3 cursor-pointer focus:bg-primary/10">
                <Edit2 className="w-4 h-4 text-blue-500" />
                <span className="text-[11px] font-bold uppercase tracking-tight">Editar Cadastro</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="rounded-xl flex items-center gap-3 py-2.5 px-3 cursor-pointer focus:bg-red-500/10 text-red-500 focus:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-tight">Remover Aluno</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      <CardContent className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xl">
             <UserCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-headline font-bold uppercase tracking-tight truncate max-w-[150px]">{member.name}</h3>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
              Plano {member.plan}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            <Phone className="w-3.5 h-3.5 text-primary" /> <span>{member.phone || "Sem telefone"}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            <Calendar className="w-3.5 h-3.5 text-primary" /> 
            <span>Matrícula: {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('pt-BR') : 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button 
            variant="ghost" 
            className="text-[9px] font-black uppercase tracking-widest h-10 w-full hover:text-primary gap-2 bg-accent/30 rounded-xl"
          >
            Ficha de Treino
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}