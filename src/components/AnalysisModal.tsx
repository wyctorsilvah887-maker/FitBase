"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeTextualInput } from "@/ai/flows/analyze-textual-input";
import { analyzeImageInput } from "@/ai/flows/analyze-image-input";
import { Loader2, Send, Camera, Upload, AlertCircle } from "lucide-react";
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">
            {type === 'text' ? 'Análise de Texto' : 'Análise de Imagem'}
          </DialogTitle>
          <DialogDescription>
            {type === 'text' 
              ? 'Descreva os sintomas do seu animal ou os ingredientes da ração para análise.' 
              : 'Tire uma foto do rótulo da ração ou do sintoma visível para análise.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!result ? (
          <div className="space-y-4 py-4">
            {type === 'text' ? (
              <>
                <Textarea 
                  placeholder="Ex: Meu cachorro está com coceira intensa na orelha e pele vermelha..." 
                  className="min-h-[150px] text-base"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  className="w-full h-12 text-lg font-medium" 
                  onClick={handleTextAnalysis}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                  Analisar Agora
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-32 flex flex-col gap-2 border-dashed border-2 hover:border-primary hover:bg-secondary/20"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="w-8 h-8 text-primary" />
                  <span>Enviar Foto</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-32 flex flex-col gap-2 border-dashed border-2 hover:border-primary hover:bg-secondary/20"
                  onClick={() => fileInputRef.current?.click()} // Camera button can also trigger file input which often prompts camera on mobile
                  disabled={isLoading}
                >
                  <Camera className="w-8 h-8 text-primary" />
                  <span>Tirar Foto</span>
                </Button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload}
                  capture="environment"
                />
                {isLoading && (
                  <div className="col-span-full flex flex-col items-center justify-center py-8 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">A IA está analisando sua imagem...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="bg-secondary/30 p-4 rounded-lg border border-teal-100">
              <h3 className="font-headline font-semibold text-primary mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Resumo da Análise
              </h3>
              <p className="text-sm leading-relaxed">
                {type === 'text' ? result.analysisSummary : result.analysis}
              </p>
            </div>
            
            {type === 'text' && (
              <>
                <div className="space-y-2">
                  <h3 className="font-headline font-semibold flex items-center gap-2">Insights</h3>
                  <div className="text-sm prose prose-slate max-w-none prose-sm leading-relaxed">
                    {result.insights}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline font-semibold flex items-center gap-2 text-accent-foreground bg-accent/20 px-3 py-1 rounded-full w-fit">Recomendações</h3>
                  <div className="text-sm font-medium leading-relaxed bg-accent/5 p-3 rounded-lg border border-accent/20">
                    {result.recommendations}
                  </div>
                </div>
              </>
            )}

            <div className="pt-4 border-t">
              <p className="text-[10px] text-muted-foreground italic uppercase tracking-wider mb-4">
                Aviso: Esta ferramenta utiliza IA e não substitui uma consulta veterinária profissional.
              </p>
              <Button className="w-full" onClick={handleClose}>
                Fechar e Voltar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}