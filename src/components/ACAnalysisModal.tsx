
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeACIssue } from "@/ai/flows/analyze-ac-issue";
import { Loader2, AlertCircle, Sparkles, ShieldCheck, UserPlus, Wind } from "lucide-react";
import { checkLimit, incrementUsage } from "@/app/lib/usage-limits";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { saveAnalysis } from "@/app/lib/history-store";
import Link from "next/link";

interface ACAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ACAnalysisModal({ isOpen, onClose }: ACAnalysisModalProps) {
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

  const handleAnalysis = async () => {
    if (!input.trim() || !user) return;
    
    const { allowed } = checkLimit('analysis', user.isAnonymous);
    if (!allowed) {
      setError(user.isAnonymous 
        ? "Limite de teste atingido. Crie uma conta gratuita para mais diagnósticos! ❄️"
        : "Limite diário atingido. Volte amanhã! ❄️");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const output = await analyzeACIssue({ description: input });
      setResult(output);
      
      const analysisRef = collection(db, "users", user.uid, "acAnalyses");
      addDocumentNonBlocking(analysisRef, {
        userId: user.uid,
        inputText: input,
        aiResponse: output,
        createdAt: serverTimestamp(),
      });

      saveAnalysis({
        type: 'text',
        input: input,
        output: output
      });

      incrementUsage('analysis');
      setLimitStatus(checkLimit('analysis', user.isAnonymous));
    } catch (err) {
      setError("Falha na comunicação com Clima IA. Tente novamente.");
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
      <DialogContent className="w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground p-0 rounded-[2.5rem] outline-none shadow-2xl">
        <div className="p-6 md:p-10 space-y-8">
          <DialogHeader className="text-left relative space-y-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <DialogTitle className="text-2xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-tight">
                  Diagnóstico <span className="animate-text-flash italic inline-block pr-2">Técnico</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-bold text-[9px] uppercase tracking-[0.2em]">
                  Análise Inteligente de Sistemas de Climatização
                </DialogDescription>
              </div>
              <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-primary">
                {limitStatus.remaining} / {limitStatus.limit}
              </div>
            </div>
          </DialogHeader>

          {error && (
            <div className="space-y-4 animate-in fade-in zoom-in">
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-bold text-[9px] uppercase tracking-widest">Aviso do Sistema</AlertTitle>
                <AlertDescription className="text-[10px] font-medium">{error}</AlertDescription>
              </Alert>
              {user?.isAnonymous && (
                <Link href="/register">
                  <Button className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[9px] tracking-[0.2em]">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta Especialista
                  </Button>
                </Link>
              )}
            </div>
          )}

          {!result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-3">Descreva o Problema (Sons, Falha, Erro no Display)</p>
                 <Textarea 
                  placeholder="Ex: Ar condicionado Split 12k BTUs não gela e apresenta ruído metálico na condensadora..." 
                  className="min-h-[150px] bg-background border-border focus-visible:ring-primary rounded-[1.5rem] p-6 text-sm resize-none border-2 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button 
                className="w-full h-12 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/10 transition-all active:scale-[0.98]" 
                onClick={handleAnalysis}
                disabled={isLoading || !input.trim() || !limitStatus.allowed}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {isLoading ? "Consultando Clima IA..." : "Iniciar Diagnóstico"}
              </Button>
              <p className="text-center text-[8px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                <Wind className="w-2.5 h-2.5" />
                Protocolo WS Studios Company
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none rounded-[1.5rem]" />
                <div className="relative z-10 bg-background/50 p-6 md:p-8 rounded-[1.5rem] border-2 border-primary/20 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Diagnóstico Provável</h3>
                    <p className="text-sm leading-relaxed text-foreground font-medium border-l-2 border-primary pl-4">
                      {result.diagnosis}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-foreground uppercase tracking-[0.3em]">Ação Técnica</h4>
                      <div className="text-[11px] text-muted-foreground bg-background p-4 rounded-xl border border-border whitespace-pre-line">
                        {result.technicalSteps}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em]">Ação Urgente</h4>
                      <div className="text-[11px] font-bold text-red-600 bg-red-500/5 p-4 rounded-xl border border-red-500/20 whitespace-pre-line">
                        {result.urgentAction}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-[10px] font-black text-foreground bg-primary/10 p-4 rounded-xl text-center">
                       ⚠️ {result.safetyWarning}
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-[1rem] text-[9px] font-black uppercase tracking-[0.3em]" 
                onClick={handleClose}
              >
                Concluir Diagnóstico
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
