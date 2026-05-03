"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeTextualInput } from "@/ai/flows/analyze-textual-input";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import { saveAnalysis } from "@/app/lib/history-store";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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

  const handleTextAnalysis = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const output = await analyzeTextualInput({ description: input });
      setResult(output);
      saveAnalysis({ type: 'text', input, output });
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
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-900 text-white p-0 rounded-[2.5rem] outline-none custom-scrollbar">
        <div className="p-8 md:p-12 space-y-8">
          <DialogHeader className="text-left relative">
            <DialogTitle className="text-3xl md:text-4xl font-headline font-black tracking-tighter uppercase">
              Nova Análise
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium text-sm md:text-base mt-2">
              Descreva os sintomas ou a dieta do seu pet.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl animate-in fade-in zoom-in">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-bold">Atenção</AlertTitle>
              <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {!result ? (
            <div className="space-y-8">
              <Textarea 
                placeholder="Ex: Meu gato comeu um pedaço de pizza e está quieto..." 
                className="min-h-[200px] bg-zinc-900/50 border-zinc-800 focus-visible:ring-primary rounded-3xl p-6 md:p-8 text-sm md:text-base placeholder:text-zinc-700 resize-none border-2 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                className="w-full h-16 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-primary/10 bg-primary text-black hover:bg-primary/90 disabled:opacity-30" 
                onClick={handleTextAnalysis}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-3" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Gerar Análise
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Veredito da IA
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-zinc-300 font-medium whitespace-pre-line">
                  {result.analysisSummary}
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] px-2">Insights Detalhados</h3>
                  <div className="text-sm md:text-base text-zinc-400 leading-relaxed whitespace-pre-line bg-zinc-900/30 p-8 rounded-3xl border border-zinc-900">
                    {result.insights.replace(/<[^>]*>?/gm, '')}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] px-2">Recomendações Vet IA</h3>
                  <div className="text-sm md:text-base font-bold leading-relaxed text-white bg-primary/10 p-8 rounded-3xl border border-primary/20 whitespace-pre-line">
                    {result.recommendations.replace(/<[^>]*>?/gm, '')}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-900">
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em] text-center mb-8 px-4">
                  A Vet IA da WS Studios é uma ferramenta auxiliar e não substitui diagnósticos clínicos.
                </p>
                <Button variant="outline" className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-zinc-800 hover:bg-zinc-900" onClick={handleClose}>
                  Finalizar Sessão
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
