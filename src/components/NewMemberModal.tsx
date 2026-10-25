
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { Loader2, UserPlus, ShieldCheck, Phone, Mail, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyFee: number;
}

export function NewMemberModal({ isOpen, onClose, monthlyFee }: NewMemberModalProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    plan: "mensal",
    status: "ativo"
  });

  const formatPhone = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength <= 2) {
      return phoneNumberLength > 0 ? `(${phoneNumber}` : phoneNumber;
    }
    if (phoneNumberLength <= 6) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    if (phoneNumberLength <= 10) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
    }
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    if (formattedValue.length <= 15) {
      setFormData({ ...formData, phone: formattedValue });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    if (!formData.name || !formData.phone) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome e o telefone do aluno.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const memberRef = collection(db, "users", user.uid, "members");
      const paymentsRef = collection(db, "users", user.uid, "payments");
      
      const memberPromise = addDocumentNonBlocking(memberRef, {
        userId: user.uid,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        plan: formData.plan,
        status: formData.status,
        joinedAt: new Date().toISOString(),
        createdAt: serverTimestamp(),
      });

      memberPromise?.then((docRef) => {
        if (docRef && monthlyFee > 0) {
          addDocumentNonBlocking(paymentsRef, {
            userId: user.uid,
            memberId: docRef.id,
            memberName: formData.name,
            amount: monthlyFee,
            status: "pago",
            dueDate: new Date().toISOString(),
            paidAt: new Date().toISOString(),
            createdAt: serverTimestamp(),
            type: 'adesao'
          });
        }
      });

      toast({
        title: "Aluno Matriculado",
        description: `${formData.name} matriculado e primeira mensalidade registrada.`,
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        plan: "mensal",
        status: "ativo"
      });
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border text-foreground p-0 rounded-[2.5rem] outline-none shadow-2xl custom-scrollbar">
        <form onSubmit={handleSubmit}>
          <div className="p-8 md:p-10 space-y-8">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-2xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-tight">
                Matricular <span className="animate-text-flash italic inline-block pr-2">Novo Aluno</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-bold text-[9px] uppercase tracking-[0.2em]">
                Cadastro de Membro FitBase
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Nome Completo do Aluno</Label>
                <Input 
                  placeholder="Nome do aluno" 
                  className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Telefone / WhatsApp</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      placeholder="(00) 00000-0000" 
                      className="h-12 pl-12 pr-6 bg-background border-border rounded-2xl focus:ring-primary border-2 transition-all"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">E-mail (Opcional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="email"
                      placeholder="aluno@exemplo.com" 
                      className="h-12 pl-12 pr-6 bg-background border-border rounded-2xl focus:ring-primary border-2 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Plano de Matrícula</Label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
                    <Select 
                      value={formData.plan} 
                      onValueChange={(value) => setFormData({...formData, plan: value})}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-12 pl-12 bg-background border-border rounded-2xl pr-6 focus:ring-primary border-2 transition-all">
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border rounded-xl">
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Status Inicial</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({...formData, status: value})}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border rounded-xl">
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="vencido">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4 mr-2" /> Efetuar Matrícula</>}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
