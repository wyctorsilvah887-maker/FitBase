"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeTextualInput } from "@/ai/flows/analyze-textual-input";
import { Loader2, AlertCircle, Sparkles, ShieldCheck, UserPlus } from "lucide-react";
import { checkLimit, incrementUsage } from "@/app/lib/usage-limits";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { saveAnalysis } from "@/app/lib/history-store";
import Link from "next/link";

interface AnalysisModalProps {
  type: 'text' | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AnalysisModal({ type, isOpen, onClose, onSuccess }: AnalysisModalProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [limitStatus, setLimitStatus] = useState({ allowed: true, remaining: 0, limit: 0 });

  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (isOpen && user) {
      setLimitStatus(checkLimit('analysis', user.isAnonymous));
    }
  }, [isOpen, user]);

  const handleTextAnalysis = async () => {
    if (!input.trim() || !user) return;
    
    const { allowed } = checkLimit('analysis', user.isAnonymous);
    if (!allowed) {
      const msg = user.isAnonymous 
        ? "Você atingiu o limite de 3 análises do modo teste. Crie uma conta gratuita para ter 6 análises diárias! 🐾"
        : "Você atingiu seu limite de 6 análises diárias. Volte amanhã! 🐾";
      setError(msg);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const output = await analyzeTextualInput({ description: input });
      setResult(output);
      
      // Salva no Firestore
      const analysisRef = collection(db, "users", user.uid, "textAnalyses");
      addDocumentNonBlocking(analysisRef, {
        userId: user.uid,
        inputText: input,
        aiResponse: output,
        createdAt: serverTimestamp(),
      });

      // Cache Local no Navegador
      saveAnalysis({
        type: 'text',
        input: input,
        output: output
      });

      incrementUsage('analysis');
      setLimitStatus(checkLimit('analysis', user.isAnonymous));
      onSuccess();
    } catch (err) {
      setError("Ocorreu um erro ao processar sua solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setInput("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground p-0 rounded-[2.5rem] outline-none custom-scrollbar shadow-2xl">
        <div className="p-6 md:p-10 space-y-8">
          <DialogHeader className="text-left relative space-y-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <DialogTitle className="text-2xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-tight">
                  Análise <span className="animate-text-flash italic inline-block pr-2">Inteligente</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-bold text-[9px] uppercase tracking-[0.2em]">
                  {user?.isAnonymous ? 'Protocolo de Teste WS Studios' : 'Diagnóstico preventivo avançado'}
                </DialogDescription>
              </div>
              <div className="bg-primary/5 border border-primary/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
                {limitStatus.remaining} / {limitStatus.limit} restantes
              </div>
            </div>
          </DialogHeader>

          {error && (
            <div className="space-y-4 animate-in fade-in zoom-in">
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-bold text-[9px] uppercase tracking-widest">Limite Atingido</AlertTitle>
                <AlertDescription className="text-[10px] font-medium opacity-80">{error}</AlertDescription>
              </Alert>
              
              {user?.isAnonymous && (
                <Link href="/register" className="block">
                  <Button className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[9px] tracking-[0.2em] hover:bg-primary/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta Agora (6 análises/dia)
                  </Button>
                </Link>
              )}
            </div>
          )}

          {!result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-3">Descrição dos Sintomas ou Dieta</p>
                 <Textarea 
                  placeholder="Ex: Meu pet está apático e não quis comer hoje..." 
                  className="min-h-[150px] bg-background border-border focus-visible:ring-primary rounded-[1.5rem] p-6 text-sm placeholder:text-muted-foreground/30 resize-none border-2 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading || !limitStatus.allowed}
                />
              </div>
              <div className="pt-2">
                <div className="relative overflow-hidden rounded-[1.25rem]">
                   <Button 
                    className="w-full h-12 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 shadow-xl shadow-primary/10 transition-all active:scale-[0.98] relative z-10" 
                    onClick={handleTextAnalysis}
                    disabled={isLoading || !input.trim() || !limitStatus.allowed}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processando Dados...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Gerar Relatório IA
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-center mt-4 text-[8px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Segurança Veterinária WS Studios
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none rounded-[1.5rem]"></div>
                <div className="relative z-10 bg-background/50 p-6 md:p-8 rounded-[1.5rem] border-2 border-primary/20 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                      <Sparkles className="w-2.5 h-2.5" />
                      Veredito Preventivo
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground font-medium whitespace-pre-line border-l-2 border-primary/30 pl-4">
                      {result.analysisSummary}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-foreground uppercase tracking-[0.3em]">Insights</h4>
                      <div className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line bg-background p-4 rounded-xl border border-border">
                        {result.insights}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Recomendações</h4>
                      <div className="text-[11px] font-bold leading-relaxed text-foreground bg-primary/5 p-4 rounded-xl border border-primary/10 whitespace-pre-line">
                        {result.recommendations}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.4em] text-center italic">
                  Relatório salvo no histórico local e em nuvem.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-[1rem] text-[9px] font-black uppercase tracking-[0.3em] border-border hover:bg-accent transition-all" 
                  onClick={handleClose}
                >
                  Concluir Análise
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}