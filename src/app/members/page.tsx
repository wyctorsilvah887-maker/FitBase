"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
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
  Trash2,
  UserCircle,
  Banknote,
  QrCode,
  Clock,
  Filter,
  Users,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { collection, query, orderBy, doc, serverTimestamp } from "firebase/firestore";
import { NewMemberModal } from "@/components/NewMemberModal";
import { useToast } from "@/hooks/use-toast";
import { deleteDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { TermsAcceptanceModal } from "@/components/TermsAcceptanceModal";
import Link from "next/link";
import { cn } from "@/lib/utils";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function MembersPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const membersQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "members"), orderBy("name", "asc"));
  }, [user, db]);

  const userRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: members, isLoading } = useCollection(membersQuery);
  const { data: userDoc, isLoading: isUserDocLoading } = useDoc(userRef);

  const filteredMembers = members?.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === "todos" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const stats = {
    total: members?.length || 0,
    ativos: members?.filter(m => m.status === 'ativo').length || 0,
    pendentes: members?.filter(m => m.status === 'pendente').length || 0,
  };

  if (isUserLoading || !user || isUserDocLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Clock className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const showTermsModal = !userDoc || !userDoc.acceptedTerms;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8 animate-in fade-in duration-700">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-headline font-bold uppercase tracking-tighter">
              Lista de <span className="text-primary italic">Alunos</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">
              Gestão de Acesso e Planos • FitBase
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <StatMiniCard label="Total" value={stats.total} icon={<Users className="w-3 h-3" />} color="text-primary" />
            <StatMiniCard label="Ativos" value={stats.ativos} icon={<CheckCircle2 className="w-3 h-3" />} color="text-emerald-500" />
            <StatMiniCard label="Pendentes" value={stats.pendentes} icon={<AlertCircle className="w-3 h-3" />} color="text-amber-500" />
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-card/50 p-4 rounded-[2rem] border-2 border-border/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
             <div className="relative group w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Pesquisar por nome ou celular..." 
                  className="pl-11 h-12 w-full bg-background border-border rounded-2xl border-2 focus-visible:ring-primary transition-all text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex gap-1 bg-background border-2 border-border p-1 rounded-2xl overflow-x-auto custom-scrollbar">
                <FilterButton active={statusFilter === "todos"} onClick={() => setStatusFilter("todos")}>Todos</FilterButton>
                <FilterButton active={statusFilter === "ativo"} onClick={() => setStatusFilter("ativo")}>Ativos</FilterButton>
                <FilterButton active={statusFilter === "pendente"} onClick={() => setStatusFilter("pendente")}>Pendentes</FilterButton>
                <FilterButton active={statusFilter === "inativo"} onClick={() => setStatusFilter("inativo")}>Inativos</FilterButton>
             </div>
          </div>

          <Button 
            onClick={() => setIsNewMemberModalOpen(true)}
            className="h-12 w-full lg:w-auto px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" /> Novo Aluno
          </Button>
        </div>

        {/* Table Section */}
        <Card className="rounded-[2.5rem] border-2 border-border bg-card overflow-hidden shadow-2xl shadow-black/5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-accent/30">
                <TableRow className="border-b-2 border-border hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-6 pl-8">Identificação do Aluno</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-6 text-center">Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-[10px] font-black uppercase tracking-widest text-muted-foreground py-6">Plano Vigente</TableHead>
                  <TableHead className="hidden md:table-cell text-[10px] font-black uppercase tracking-widest text-muted-foreground py-6">Contato Direto</TableHead>
                  <TableHead className="hidden lg:table-cell text-[10px] font-black uppercase tracking-widest text-muted-foreground py-6">Início</TableHead>
                  <TableHead className="text-right py-6 pr-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="animate-pulse border-b border-border/50">
                      <TableCell colSpan={6} className="h-20 bg-accent/5"></TableCell>
                    </TableRow>
                  ))
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <MemberRow 
                      key={member.id} 
                      member={member} 
                      userId={user.uid} 
                      monthlyFee={userDoc?.monthlyFee || 0}
                      gymName={userDoc?.gymName || "FitBase"}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-6 max-w-xs mx-auto">
                        <div className="w-20 h-20 rounded-[2rem] bg-primary/5 flex items-center justify-center border-2 border-dashed border-primary/20">
                          <UserPlus className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground uppercase tracking-tight">Nenhum aluno encontrado</p>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-relaxed">
                            Tente ajustar os filtros ou cadastrar um novo membro no sistema.
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsNewMemberModalOpen(true)}
                          className="rounded-xl text-[10px] font-black uppercase tracking-widest h-11 px-8 border-2 hover:bg-primary/5 hover:text-primary transition-all"
                        >
                          Começar Cadastro
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>

      <NewMemberModal 
        isOpen={isNewMemberModalOpen} 
        onClose={() => setIsNewMemberModalOpen(false)} 
        monthlyFee={userDoc?.monthlyFee || 0}
      />

      <TermsAcceptanceModal isOpen={showTermsModal} />
    </div>
  );
}

function StatMiniCard({ label, value, icon, color }: { label: string, value: number, icon: any, color: string }) {
  return (
    <div className="flex flex-col items-center md:items-start gap-1 p-3 md:px-5 md:py-4 rounded-2xl bg-card border-2 border-border/50">
      <div className={cn("flex items-center gap-2 text-[9px] font-black uppercase tracking-widest", color)}>
        {icon} {label}
      </div>
      <span className="text-xl md:text-2xl font-headline font-bold tracking-tighter leading-none">{value}</span>
    </div>
  );
}

function FilterButton({ children, active, onClick }: { children: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
        active ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function MemberRow({ member, userId, monthlyFee, gymName }: { member: any, userId: string, monthlyFee: number, gymName: string }) {
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

  const handleQuickAction = (type: 'renovacao' | 'adiantado', method: 'pix' | 'cedula') => {
    if (monthlyFee <= 0) {
      toast({
        variant: "destructive",
        title: "Mensalidade não configurada",
        description: "Defina o valor da mensalidade no Dashboard para usar esta função.",
      });
      return;
    }

    const paymentsRef = collection(db, "users", userId, "payments");
    addDocumentNonBlocking(paymentsRef, {
      userId,
      memberId: member.id,
      memberName: member.name,
      amount: monthlyFee,
      status: "pago",
      paymentMethod: method,
      dueDate: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
      type: type
    });

    toast({
      title: type === 'renovacao' ? "Plano Renovado" : "Pagamento Confirmado",
      description: `${type === 'renovacao' ? 'Renovação' : 'Pagamento'} de ${member.name} via ${method.toUpperCase()} registrado.`,
    });
  };

  const handleWhatsAppReminder = () => {
    if (!member.phone) {
      toast({
        variant: "destructive",
        title: "Telefone não cadastrado",
        description: "Adicione um número de telefone para enviar o lembrete.",
      });
      return;
    }

    const cleanPhone = member.phone.replace(/\D/g, "");
    const message = `Olá ${member.name}! 🏋️‍♂️ Passando para lembrar que seu plano na ${gymName} está próximo do vencimento ou já venceu. Vamos renovar para não perder o ritmo dos treinos? 💪🔥`;
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
  };

  return (
    <TableRow className="border-b border-border/50 hover:bg-accent/20 transition-all group">
      <TableCell className="py-5 pl-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[1.25rem] bg-primary/5 border-2 border-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
            <UserCircle className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors truncate">{member.name}</p>
            <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest truncate">{member.email || "Sem e-mail cadastrado"}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-5 text-center">
        <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-widest border-2 px-3 py-1", config.color)}>
          {config.label}
        </Badge>
      </TableCell>
      <TableCell className="hidden sm:table-cell py-5">
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
          {member.plan}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell py-5">
        <div className="flex items-center gap-2.5 text-[11px] font-bold text-muted-foreground">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span>{member.phone || "---"}</span>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell py-5">
        <div className="flex items-center gap-2.5 text-[11px] font-bold text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('pt-BR') : '---'}</span>
        </div>
      </TableCell>
      <TableCell className="py-5 pr-8 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-accent border border-transparent hover:border-border transition-all">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-[1.5rem] border-2 border-border p-2 shadow-2xl animate-in zoom-in duration-200">
            <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground px-4 py-3">
              Gestão de Matrícula
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rounded-xl flex items-center gap-3 py-3 px-4 cursor-pointer focus:bg-primary/10 group">
                <RefreshCcw className="w-4 h-4 text-primary group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[11px] font-bold uppercase tracking-tight">Renovação Rápida</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent 
                side="left" 
                align="start"
                sideOffset={12}
                className="rounded-2xl border-2 border-border p-2 min-w-[160px] shadow-2xl bg-popover"
              >
                <DropdownMenuItem onClick={() => handleQuickAction('renovacao', 'pix')} className="rounded-xl py-2.5 px-4 flex items-center gap-3 cursor-pointer focus:bg-primary/10">
                  <QrCode className="w-4 h-4 text-primary" /> PIX
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickAction('renovacao', 'cedula')} className="rounded-xl py-2.5 px-4 flex items-center gap-3 cursor-pointer focus:bg-emerald-500/10">
                  <Banknote className="w-4 h-4 text-emerald-500" /> Dinheiro
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rounded-xl flex items-center gap-3 py-3 px-4 cursor-pointer focus:bg-emerald-500/10">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-tight">Pagamento Antecipado</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent 
                side="left" 
                align="start"
                sideOffset={12}
                className="rounded-2xl border-2 border-border p-2 min-w-[160px] shadow-2xl bg-popover"
              >
                <DropdownMenuItem onClick={() => handleQuickAction('adiantado', 'pix')} className="rounded-xl py-2.5 px-4 flex items-center gap-3 cursor-pointer focus:bg-primary/10">
                  <QrCode className="w-4 h-4 text-primary" /> PIX
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickAction('adiantado', 'cedula')} className="rounded-xl py-2.5 px-4 flex items-center gap-3 cursor-pointer focus:bg-emerald-500/10">
                  <Banknote className="w-4 h-4 text-emerald-500" /> Dinheiro
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuItem 
              onClick={handleWhatsAppReminder}
              className="rounded-xl flex items-center gap-3 py-3 px-4 cursor-pointer focus:bg-emerald-500/10 text-emerald-600 focus:text-emerald-600"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-tight">Cobrança WhatsApp</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDelete}
              className="rounded-xl flex items-center gap-3 py-3 px-4 cursor-pointer focus:bg-red-500/10 text-red-500 focus:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-tight">Remover Aluno</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
