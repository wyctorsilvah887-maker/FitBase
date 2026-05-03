"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] sm:max-w-lg bg-zinc-950 border-zinc-900 text-white rounded-[2rem] outline-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline font-black uppercase tracking-tighter">Termos de Uso</DialogTitle>
          <DialogDescription className="text-zinc-500 text-[10px] uppercase tracking-widest">Vet IA • WS Studios</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] mt-4 pr-4 custom-scrollbar">
          <div className="space-y-4 text-[11px] leading-relaxed text-zinc-400 font-medium">
            <p>
              1. A Vet IA é uma ferramenta de inteligência artificial experimental desenvolvida pela WS Studios para fins informativos e educacionais.
            </p>
            <p>
              2. As análises geradas não constituem um diagnóstico veterinário oficial. É obrigatório consultar um médico veterinário presencialmente para qualquer decisão de saúde do seu animal.
            </p>
            <p>
              3. Ao utilizar o serviço, você concorda que o processamento de dados é realizado de forma anônima para a melhoria dos modelos de IA.
            </p>
            <p>
              4. A WS Studios não se responsabiliza por interpretações equivocadas dos resultados ou ações tomadas sem supervisão profissional.
            </p>
            <p>
              5. O limite de uso diário é aplicado para garantir a disponibilidade do sistema para todos os usuários.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
