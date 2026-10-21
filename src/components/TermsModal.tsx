"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scale } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] sm:max-w-lg bg-zinc-950 border-zinc-900 text-white rounded-[2rem] outline-none">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-5 h-5 text-primary" />
            <DialogTitle className="text-xl font-headline font-black uppercase tracking-tighter">Limitações de Responsabilidade</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-500 text-[10px] uppercase tracking-widest text-left">FitBase • Proteção Jurídica WS Studios</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] mt-4 pr-4 custom-scrollbar">
          <div className="space-y-4 text-[11px] leading-relaxed text-zinc-400 font-medium text-justify">
            <p>
              1. O FitBase é uma plataforma tecnológica licenciada para fins de organização administrativa, não constituindo recomendação profissional de qualquer natureza.
            </p>
            <p>
              2. A responsabilidade por danos físicos decorrentes da prática de exercícios é integral do Usuário e de seus alunos, estando a WS Studios Company isenta de qualquer nexo causal sobre tais eventos.
            </p>
            <p>
              3. O processamento de dados é realizado em nuvem segura, porém a salvaguarda de senhas e acessos é responsabilidade exclusiva do Usuário.
            </p>
            <p>
              4. Eventuais insights gerados por IA são estatísticos e não substituem o discernimento humano ou consultoria especializada individualizada.
            </p>
            <p>
              5. Ao utilizar esta ferramenta, o Usuário renuncia a qualquer pretensão indenizatória contra a desenvolvedora em caso de indisponibilidade técnica momentânea ou perda de dados causada por mau uso do software.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
