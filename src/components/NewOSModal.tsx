
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { Loader2, ClipboardCheck, DollarSign, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewOSModal({ isOpen, onClose }: NewOSModalProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    equipment: "",
    btus: "",
    value: "",
    status: "pendente"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    if (!formData.customerName || !formData.equipment || !formData.value) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome do cliente, equipamento e valor.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const osRef = collection(db, "users", user.uid, "serviceOrders");
      
      addDocumentNonBlocking(osRef, {
        userId: user.uid,
        customerName: formData.customerName,
        equipment: formData.equipment,
        btus: formData.btus,
        status: formData.status,
        value: parseFloat(formData.value.replace(',', '.')),
        date: new Date().toISOString(),
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Ordem de Serviço Criada",
        description: `OS para ${formData.customerName} registrada com sucesso.`,
      });

      setFormData({
        customerName: "",
        equipment: "",
        btus: "",
        value: "",
        status: "pendente"
      });
      onClose();
    } catch (error) {
      console.error("Erro ao criar OS:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-lg bg-card border-border text-foreground p-0 rounded-[2.5rem] outline-none shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="p-8 md:p-10 space-y-8">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-2xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-tight">
                Nova <span className="animate-text-flash italic inline-block pr-2">Ordem de Serviço</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-bold text-[9px] uppercase tracking-[0.2em]">
                Registro de Atendimento Técnico WS Studios
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Nome do Cliente / Empresa</Label>
                <Input 
                  placeholder="Ex: Condomínio Solar ou João Silva" 
                  className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Equipamento</Label>
                  <div className="relative">
                    <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Ex: Split Hi-Wall" 
                      className="h-12 pl-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all"
                      value={formData.equipment}
                      onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Capacidade (BTUs)</Label>
                  <Input 
                    placeholder="Ex: 12.000" 
                    className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all"
                    value={formData.btus}
                    onChange={(e) => setFormData({...formData, btus: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Valor do Serviço (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <Input 
                      type="text"
                      placeholder="0,00" 
                      className="h-12 pl-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all font-bold"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      disabled={isSubmitting}
                    />
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
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border rounded-xl">
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
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
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ClipboardCheck className="w-4 h-4 mr-2" /> Gerar Ordem</>}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
