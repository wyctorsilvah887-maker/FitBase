
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface TermsAcceptanceModalProps {
  isOpen: boolean;
}

export function TermsAcceptanceModal({ isOpen }: TermsAcceptanceModalProps) {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useUser();
  const db = useFirestore();

  const handleAccept = () => {
    if (!user || !db || !hasAgreed || isAnimating) return;

    setIsAnimating(true);
    
    // Simula a ativação do protocolo com animação antes do commit no banco
    setTimeout(() => {
      const userRef = doc(db, 'users', user.uid);
      
      // Salvando aceitação com data e hora exatas do servidor
      setDocumentNonBlocking(userRef, {
        acceptedTerms: true,
        acceptedAt: serverTimestamp(), // Captura Data e Hora simultaneamente
        email: user.email,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      setIsAnimating(false);
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="w-[92vw] sm:max-w-md bg-black border-zinc-900 text-white rounded-[2.5rem] p-0 outline-none shadow-2xl overflow-hidden [&>button]:hidden"
      >
        <div className="p-6 md:p-10 space-y-8">
          <DialogHeader className="text-center space-y-4">
            {/* Logo FitBase com Flash Gradiente Contínuo e Sweep ao Clicar */}
            <div className="mx-auto w-20 h-20 rounded-[2rem] bg-black border-2 border-primary/30 flex items-center justify-center relative overflow-hidden shadow-2xl shadow-primary/5 animate-icon-flash group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
              
              {/* Sweep Animation Effect no Logo */}
              {isAnimating && (
                <div className="absolute inset-0 z-30 pointer-events-none">
                  <div className="w-[150%] h-full bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-sweep -left-1/4" />
                </div>
              )}
              
              <div className="relative z-10 w-12 h-12 transition-transform duration-500 group-hover:scale-110">
                <Image src="/logo fitbase.png" alt="FitBase" fill className="object-contain" />
              </div>
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-2xl md:text-3xl font-headline font-black uppercase tracking-tighter">
                <span className="animate-text-flash italic inline-block pr-2 leading-none">Segurança</span> 
                <span className="text-white">&</span> 
                <span className="text-zinc-500 block sm:inline"> Privacidade</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">
                FitBase • Protocolo de Gestão Digital
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none z-10" />
            <ScrollArea className="h-[140px] md:h-[180px] pr-4 text-[10px] md:text-[11px] leading-relaxed text-zinc-500 font-medium custom-scrollbar">
              <div className="space-y-6 pb-8">
                <div className="space-y-2">
                  <h4 className="text-zinc-300 font-black uppercase tracking-widest text-[9px]">01. Natureza da Plataforma</h4>
                  <p>O FitBase é um assistente de gestão inteligente. Os dados são armazenados de forma segura em nuvem para facilitar o controle da sua academia.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-zinc-300 font-black uppercase tracking-widest text-[9px]">02. Uso Responsável</h4>
                  <p>O gestor é o único responsável pelos dados de alunos e pagamentos inseridos na plataforma.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-zinc-300 font-black uppercase tracking-widest text-[9px]">03. Tratamento de Dados</h4>
                  <p>Seus dados são protegidos conforme a LGPD. Utilizamos criptografia de ponta para garantir a privacidade das suas informações comerciais.</p>
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <div 
              className="flex items-center space-x-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-900 transition-all hover:border-primary/20 group cursor-pointer" 
              onClick={() => setHasAgreed(!hasAgreed)}
            >
              <Checkbox 
                id="terms" 
                checked={hasAgreed} 
                onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
                className="border-zinc-800 data-[state=checked]:bg-primary data-[state=checked]:text-black h-5 w-5 rounded-lg transition-all"
              />
              <label 
                htmlFor="terms" 
                className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none cursor-pointer group-hover:text-zinc-400 transition-colors"
              >
                Li e concordo com os termos
              </label>
            </div>

            <DialogFooter>
              <div className="relative w-full overflow-hidden rounded-[1.5rem]">
                {/* Sweep Animation Effect no Botão */}
                {isAnimating && (
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="w-[150%] h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-sweep -left-1/4" />
                  </div>
                )}
                <Button 
                  className="w-full h-14 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] bg-primary text-black hover:bg-primary/90 disabled:opacity-10 transition-all relative z-10 shadow-xl shadow-primary/10 active:scale-[0.98]"
                  disabled={!hasAgreed || isAnimating}
                  onClick={handleAccept}
                >
                  {isAnimating ? "Ativando Protocolo..." : "Confirmar e Iniciar"}
                </Button>
              </div>
            </DialogFooter>
          </div>

          <div className="flex items-center justify-center gap-3 opacity-20 grayscale hover:opacity-40 transition-all duration-700">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">FitBase Security Shield</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
