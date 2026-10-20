"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { Loader2, DollarSign, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RenewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any | null;
}

export function RenewPlanModal({ isOpen, onClose, member }: RenewPlanModalProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !member || !amount) return;

    setIsSubmitting(true);

    try {
      const paymentsRef = collection(db, "users", user.uid, "payments");
      
      const paymentAmount = parseFloat(amount.replace(',', '.'));

      addDocumentNonBlocking(paymentsRef, {
        userId: user.uid,
        memberId: member.id,
        memberName: member.name,
        amount: paymentAmount,
        status: "pago",
        dueDate: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Renovação Confirmada",
        description: `O plano de ${member.name} foi renovado com sucesso.`,
      });

      setAmount("");
      onClose();
    } catch (error) {
      console.error("Erro ao renovar plano:", error);
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
                Renovação de <span className="text-primary italic">Plano</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-bold text-[9px] uppercase tracking-[0.2em]">
                Aluno: {member?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Valor da Renovação (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <Input 
                    type="text"
                    placeholder="0,00" 
                    className="h-14 pl-12 pr-6 bg-background border-border rounded-2xl focus:ring-primary border-2 transition-all font-bold text-lg"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center mt-2">
                  A renovação será registrada como "Paga" no histórico
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
                disabled={isSubmitting || !amount}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Confirmar Renovação</>}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}