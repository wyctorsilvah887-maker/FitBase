
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { Loader2, UserPlus, ShieldCheck, Wrench, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTechnicianModal({ isOpen, onClose }: NewTechnicianModalProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    status: "ativo"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    if (!formData.name || !formData.specialty) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome e a especialidade do técnico.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const techRef = collection(db, "users", user.uid, "technicians");
      
      addDocumentNonBlocking(techRef, {
        userId: user.uid,
        name: formData.name,
        specialty: formData.specialty,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Técnico Cadastrado",
        description: `${formData.name} foi adicionado à equipe com sucesso.`,
      });

      setFormData({
        name: "",
        specialty: "",
        phone: "",
        email: "",
        status: "ativo"
      });
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar técnico:", error);
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
                Novo <span className="animate-text-flash italic inline-block pr-2">Técnico Colaborador</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-bold text-[9px] uppercase tracking-[0.2em]">
                Expansão de Equipe WS Studios Company
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Nome Completo</Label>
                <Input 
                  placeholder="Nome do especialista" 
                  className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Especialidade Principal</Label>
                <div className="relative">
                  <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Ex: Refrigeração Inverter, VRF, PMOC..." 
                    className="h-12 pl-12 pr-6 bg-background border-border rounded-2xl focus:ring-primary border-2 transition-all"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
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
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Email de Contato</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="email"
                      placeholder="tecnico@exemplo.com" 
                      className="h-12 pl-12 pr-6 bg-background border-border rounded-2xl focus:ring-primary border-2 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Status de Disponibilidade</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-12 bg-background border-border rounded-2xl px-6 focus:ring-primary border-2 transition-all">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border rounded-xl">
                    <SelectItem value="ativo">Disponível para Campo</SelectItem>
                    <SelectItem value="inativo">Indisponível / Férias</SelectItem>
                  </SelectContent>
                </Select>
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
                className="rounded-2xl h-14 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/10 sm:flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4 mr-2" /> Credenciar Técnico</>}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
