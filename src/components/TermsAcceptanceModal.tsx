'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, PawPrint } from 'lucide-react';

interface TermsAcceptanceModalProps {
  isOpen: boolean;
}

export function TermsAcceptanceModal({ isOpen }: TermsAcceptanceModalProps) {
  const [hasAgreed, setHasAgreed] = useState(false);
  const { user } = useUser();
  const db = useFirestore();

  const handleAccept = () => {
    if (!user || !db || !hasAgreed) return;

    const userRef = doc(db, 'users', user.uid);
    setDocumentNonBlocking(userRef, {
      acceptedTerms: true,
      acceptedAt: serverTimestamp(),
      email: user.email,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="w-[92vw] sm:max-w-md bg-black border-zinc-900 text-white rounded-[2rem] p-0 outline-none shadow-2xl overflow-hidden [&>button]:hidden"
      >
        <div className="p-6 md:p-8 space-y-5">
          <DialogHeader className="text-center space-y-3">
            <div className="mx-auto bg-primary/10 p-3 rounded-full ring-2 ring-primary/20 w-fit relative">
              {/* Efeito de Flash/Brilho no Escudo */}
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl" />
              <ShieldCheck className="h-8 w-8 text-primary relative z-10" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl md:text-2xl font-headline font-black uppercase tracking-tighter">
                Segurança <span className="text-primary italic">&</span> Privacidade
              </DialogTitle>
              <DialogDescription className="text-zinc-600 text-[8px] uppercase font-bold tracking-[0.2em]">
                WS Studios • Protocolo Veterinário
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
            <ScrollArea className="h-[160px] md:h-[180px] pr-3 text-[10px] md:text-[11px] leading-relaxed text-zinc-500 font-medium">
              <div className="space-y-4 pb-6">
                <p>
                  <strong className="text-zinc-300">1. Natureza da IA:</strong> Você compreende que a Vet IA é um assistente experimental da WS Studios. As análises são baseadas em processamento de dados e não substituem exames clínicos presenciais.
                </p>
                <p>
                  <strong className="text-zinc-300">2. Uso Responsável:</strong> O tutor é o único responsável pelas ações tomadas com base nas informações recebidas. Em caso de emergência, procure um veterinário imediatamente.
                </p>
                <p>
                  <strong className="text-zinc-300">3. Tratamento de Dados:</strong> Suas interações são processadas para melhorar a precisão da IA. Seus dados são protegidos conforme a LGPD e nunca compartilhados sem consentimento.
                </p>
                <p>
                  <strong className="text-zinc-300">4. Limitações:</strong> O sistema possui limites de uso diário para garantir a qualidade do serviço para toda a comunidade de tutores.
                </p>
              </div>
            </ScrollArea>
          </div>

          <div className="flex items-center space-x-3 bg-zinc-950 p-3 rounded-xl border border-zinc-900 transition-all hover:border-primary/20 group">
            <Checkbox 
              id="terms" 
              checked={hasAgreed} 
              onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
              className="border-zinc-800 data-[state=checked]:bg-primary data-[state=checked]:text-black h-4 w-4 rounded-md"
            />
            <label 
              htmlFor="terms" 
              className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none cursor-pointer group-hover:text-zinc-400 transition-colors"
            >
              Li e concordo com os termos
            </label>
          </div>

          <DialogFooter className="pt-1">
            <Button 
              className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-black hover:bg-primary/90 disabled:opacity-10 transition-all"
              disabled={!hasAgreed}
              onClick={handleAccept}
            >
              Confirmar e Iniciar
            </Button>
          </DialogFooter>

          <div className="flex items-center justify-center gap-2 opacity-10 grayscale">
            <PawPrint className="w-2.5 h-2.5 text-primary" />
            <span className="text-[7px] font-black uppercase tracking-widest text-white">Vet IA Security Shield</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
