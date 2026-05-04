'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, PawPrint, Lock } from 'lucide-react';

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
        className="w-[95vw] sm:max-w-lg bg-black border-zinc-900 text-white rounded-[2.5rem] p-0 outline-none shadow-2xl overflow-hidden [&>button]:hidden"
      >
        <div className="p-8 md:p-10 space-y-6">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto bg-primary/10 p-4 rounded-full ring-1 ring-primary/20 w-fit">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-headline font-black uppercase tracking-tighter">
                Segurança <span className="text-primary italic">&</span> Privacidade
              </DialogTitle>
              <DialogDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">
                WS Studios • Compromisso Veterinário
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none z-10 h-full" />
            <ScrollArea className="h-[200px] pr-4 text-[11px] leading-relaxed text-zinc-400 font-medium">
              <div className="space-y-4 pb-8">
                <p>
                  <strong className="text-white">1. Natureza da IA:</strong> Você compreende que a Vet IA é um assistente experimental da WS Studios. As análises são baseadas em processamento de dados e não substituem exames clínicos.
                </p>
                <p>
                  <strong className="text-white">2. Uso Responsável:</strong> O tutor é o único responsável pelas ações tomadas com base nas informações recebidas. Em caso de emergência, procure um veterinário presencial imediatamente.
                </p>
                <p>
                  <strong className="text-white">3. Tratamento de Dados:</strong> Suas interações são processadas para melhorar a precisão da IA. Seus dados pessoais são protegidos conforme a LGPD e nunca compartilhados sem consentimento.
                </p>
                <p>
                  <strong className="text-white">4. Limitações:</strong> O sistema possui limites de uso diário para garantir a qualidade do serviço para toda a comunidade de tutores.
                </p>
              </div>
            </ScrollArea>
          </div>

          <div className="flex items-center space-x-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-900 transition-all hover:border-primary/30 group">
            <Checkbox 
              id="terms" 
              checked={hasAgreed} 
              onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
              className="border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:text-black h-5 w-5 rounded-md"
            />
            <label 
              htmlFor="terms" 
              className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none cursor-pointer group-hover:text-zinc-300 transition-colors"
            >
              Li e concordo com os termos de uso
            </label>
          </div>

          <DialogFooter className="pt-2">
            <Button 
              className="w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] bg-primary text-black hover:bg-primary/90 disabled:opacity-20 transition-all"
              disabled={!hasAgreed}
              onClick={handleAccept}
            >
              Confirmar e Entrar
            </Button>
          </DialogFooter>

          <div className="flex items-center justify-center gap-2 opacity-20 grayscale">
            <PawPrint className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Vet IA Security Protocol</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
