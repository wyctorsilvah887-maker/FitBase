"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeTextualInput } from "@/ai/flows/analyze-textual-input";
import { analyzeImageInput } from "@/ai/flows/analyze-image-input";
import { Loader2, Send, Camera, Upload, AlertCircle, Sparkles } from "lucide-react";
import { saveAnalysis } from "@/app/lib/history-store";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AnalysisModalProps {
  type: 'text' | 'image' | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AnalysisModal({ type, isOpen, onClose, onSuccess }: AnalysisModalProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageAnalysis = async (dataUri: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const output = await analyzeImageInput({ photoDataUri: dataUri });
      setResult(output);
      saveAnalysis({ type: 'image', input: dataUri, output });
      onSuccess();
    } catch (err) {
      setError("Não foi possível analisar a imagem. Certifique-se de que é um formato válido.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      handleImageAnalysis(dataUri);
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setResult(null);
    setInput("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-900 text-white p-0 overflow-hidden rounded-3xl">
        <div className="p-8 space-y-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline font-black tracking-tight">
              {type === 'text' ? 'Análise de Texto' : 'Análise de Imagem'}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              {type === 'text' 
                ? 'Descreva o que seu pet está sentindo para uma análise profunda.' 
                : 'Envie uma foto do alimento ou do sintoma visível.'}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold">Ops!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!result ? (
            <div className="space-y-6">
              {type === 'text' ? (
                <>
                  <Textarea 
                    placeholder="Ex: Meu cachorro está com coceira intensa e vermelhidão na orelha esquerda..." 
                    className="min-h-[180px] bg-zinc-900 border-zinc-800 focus-visible:ring-primary rounded-2xl p-6 text-base placeholder:text-zinc-700"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button 
                    className="w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/10" 
                    onClick={handleTextAnalysis}
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    Gerar Análise IA
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-40 flex flex-col gap-3 bg-zinc-900/50 border-zinc-800 border-dashed border-2 hover:border-primary hover:bg-primary/5 rounded-2xl transition-all"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <div className="p-3 rounded-full bg-primary/10">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Enviar Arquivo</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-40 flex flex-col gap-3 bg-zinc-900/50 border-zinc-800 border-dashed border-2 hover:border-primary hover:bg-primary/5 rounded-2xl transition-all"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <div className="p-3 rounded-full bg-primary/10">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Usar Câmera</span>
                  </Button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload}
                  />
                  {isLoading && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 gap-4 animate-in fade-in zoom-in">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
                      </div>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Analisando Bio-dados...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Veredito da IA
                </h3>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {type === 'text' ? result.analysisSummary : result.analysis}
                </p>
              </div>
              
              {type === 'text' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Insights Detalhados</h3>
                    <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                      {result.insights}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Próximos Passos</h3>
                    <div className="text-sm font-bold leading-relaxed text-white bg-primary/10 p-6 rounded-2xl border border-primary/20 whitespace-pre-line">
                      {result.recommendations}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-zinc-900">
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center mb-6">
                  AVISO: RESULTADOS BASEADOS EM IA. CONSULTE UM VETERINÁRIO.
                </p>
                <Button className="w-full h-12 rounded-xl font-bold uppercase tracking-widest" onClick={handleClose}>
                  Finalizar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
