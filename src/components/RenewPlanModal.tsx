
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";
import { Loader2, DollarSign, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RenewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any | null;
  defaultAmount?: number;
}

export function RenewPlanModal({ isOpen, onClose, member, defaultAmount = 0 }: RenewPlanModalProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState("0,00");

  useEffect(() => {
    if (isOpen && defaultAmount > 0) {
      setAmount(defaultAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [isOpen, defaultAmount]);

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const cents = parseInt(digits || "0") / 100;
    return cents.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !member || !amount || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const paymentsRef = collection(db, "users", user.uid, "payments");
      const memberRef = doc(db, "users", user.uid, "members", member.id);
      
      const paymentAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));

      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        toast({
          variant: "destructive",
          title: "Valor inválido",
          description: "Por favor, insira um valor maior que zero.",
        });
        setIsSubmitting(false);
        return;
      }

      // 1. Calcula Novo Início e Novo Vencimento
      const now = new Date();
      let baseDate = new Date(member.expiryDate || now);
      
      // Se já venceu, o novo período começa HOJE
      // Se ainda é ativo, o novo período começa quando o atual terminar (extensão)
      if (baseDate < now) {
        baseDate = now;
      }

      const newJoinedAt = baseDate.toISOString();
      let nextExpiry = new Date(baseDate);

      if (member.plan === 'mensal') nextExpiry.setMonth(nextExpiry.getMonth() + 1);
      else if (member.plan === 'trimestral') nextExpiry.setMonth(nextExpiry.getMonth() + 3);
      else if (member.plan === 'anual') nextExpiry.setFullYear(nextExpiry.getFullYear() + 1);

      const newExpiryDate = nextExpiry.toISOString();

      // 2. Registra o Pagamento no Histórico
      addDocumentNonBlocking(paymentsRef, {
        userId: user.uid,
        memberId: member.id,
        memberName: member.name,
        amount: paymentAmount,
        status: "pago",
        dueDate: now.toISOString(),
        paidAt: now.toISOString(),
        createdAt: serverTimestamp(),
        type: 'renovacao',
        paymentMethod: 'pix'
      });

      // 3. Atualiza o Aluno com novas datas (Padrão não-bloqueante)
      updateDocumentNonBlocking(memberRef, {
        status: 'ativo',
        joinedAt: newJoinedAt,
        expiryDate: newExpiryDate,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Renovação Confirmada",
        description: `${member.name} está ativo até ${nextExpiry.toLocaleDateString('pt-BR')}.`,
      });

      onClose();
    } catch (error) {
      console.error("Erro ao renovar plano:", error);
      toast({
        variant: "destructive",
        title: "Erro na renovação",
        description: "Não foi possível atualizar os dados do aluno.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-md bg-card border-border text-foreground p-0 rounded-[2.5rem] outline-none shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="p-8 md:p-10 space-y-8">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-2xl font-headline font-black tracking-tighter uppercase leading-tight">
                Confirmar <span className="text-primary italic">Renovação</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-bold text-[9px] uppercase tracking-[0.2em]">
                Membro: {member?.name} • Plano {member?.plan}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Valor do Recebimento (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <Input 
                    type="text"
                    placeholder="0,00" 
                    className="h-14 pl-12 pr-6 bg-background border-border rounded-2xl focus:ring-primary border-2 transition-all font-bold text-lg"
                    value={amount}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center mt-2 leading-relaxed">
                  O status será alterado para <span className="text-emerald-500">Ativo</span> e a data de vencimento será estendida automaticamente.
                </p>
              </div>
            </div>

            <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                className="rounded-2xl h-14 text-[10px] font-black uppercase tracking-widest sm:flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="rounded-2xl h-14 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 sm:flex-1"
                disabled={isSubmitting || amount === "0,00"}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Confirmar</>}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
