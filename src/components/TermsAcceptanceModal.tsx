'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, Scale } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
    
    setTimeout(() => {
      const userRef = doc(db, 'users', user.uid);
      
      setDocumentNonBlocking(userRef, {
        acceptedTerms: true,
        acceptedAt: serverTimestamp(),
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
          <DialogHeader className="text-center space-y-6">
            <div className="mx-auto flex items-center justify-center relative overflow-hidden animate-icon-flash group">
              {isAnimating && (
                <div className="absolute inset-0 z-30 pointer-events-none">
                  <div className="w-[150%] h-full bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-sweep -left-1/4" />
                </div>
              )}
              
              <div className="relative z-10 w-20 h-20 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center bg-zinc-900 rounded-2xl border border-zinc-800">
                <Scale className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-2xl md:text-3xl font-headline font-black uppercase tracking-tighter">
                <span className="animate-text-flash italic inline-block pr-2 leading-none">Segurança</span> 
                <span className="text-white">&</span> 
                <span className="text-zinc-500 block sm:inline"> Jurídico</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">
                Acordo de Licenciamento de Uso FitBase
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
            <ScrollArea className="h-[160px] md:h-[200px] pr-4 text-[10px] md:text-[11px] leading-relaxed text-zinc-500 font-medium custom-scrollbar">
              <div className="space-y-6 pb-8 text-justify">
                <div className="space-y-2">
                  <h4 className="text-zinc-300 font-black uppercase tracking-widest text-[9px]">01. Responsabilidade do Controlador</h4>
                  <p>Ao aceitar estes termos, você declara ser o Gestor (Controlador) dos dados inseridos, assumindo total responsabilidade jurídica pela coleta e tratamento de dados de terceiros (alunos) conforme a LGPD brasileira.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-zinc-300 font-black uppercase tracking-widest text-[9px]">02. Exclusão de Danos Morais/Físicos</h4>
                  <p>A plataforma não possui qualquer ingerência na prestação de serviço físico da academia, restando isenta de responsabilidade sobre acidentes, lesões ou intercorrências médicas nas dependências do Usuário.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-zinc-300 font-black uppercase tracking-widest text-[9px]">03. Natureza Probatória</h4>
                  <p>Este sistema é uma ferramenta de gestão. Registros financeiros aqui contidos servem como histórico administrativo e não possuem fé pública bancária automática sem suporte documental externo.</p>
                </div>
                <div className="pt-4 border-t border-zinc-900">
                  <p className="italic text-[9px]">Leia o documento completo em <Link href="/terms" className="text-primary underline">nossa página legal</Link>.</p>
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
                className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-tight cursor-pointer group-hover:text-zinc-400 transition-colors"
              >
                Declaro que li e aceito as condições contratuais e limitações de responsabilidade do FitBase.
              </label>
            </div>

            <DialogFooter>
              <div className="relative w-full overflow-hidden rounded-[1.5rem]">
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
                  {isAnimating ? "Validando Protocolo..." : "Assinar e Ativar Sistema"}
                </Button>
              </div>
            </DialogFooter>
          </div>

          <div className="flex items-center justify-center gap-3 opacity-20 grayscale hover:opacity-40 transition-all duration-700">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Certificado Digital FitBase</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
