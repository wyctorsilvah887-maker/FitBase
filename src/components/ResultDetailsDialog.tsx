"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnalysisEntry } from "@/app/lib/history-store";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ResultDetailsDialogProps {
  entry: AnalysisEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResultDetailsDialog({ entry, isOpen, onClose }: ResultDetailsDialogProps) {
  if (!entry) return null;

  const result = entry.output;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-3">
            {entry.type === 'text' ? 'Histórico: Análise de Texto' : 'Histórico: Análise de Imagem'}
          </DialogTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Calendar className="w-3 h-3" />
            {format(entry.timestamp, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Entrada:</h3>
            {entry.type === 'text' ? (
              <p className="text-sm bg-muted/30 p-3 rounded-md italic">"{entry.input}"</p>
            ) : (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <img src={entry.input} alt="Análise de entrada" className="object-cover w-full h-full" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-secondary/30 p-4 rounded-lg border border-teal-100">
              <h3 className="font-headline font-semibold text-primary mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Resultado da IA
              </h3>
              <p className="text-sm leading-relaxed">
                {entry.type === 'text' ? result.analysisSummary : result.analysis}
              </p>
            </div>
            
            {entry.type === 'text' && (
              <>
                <div className="space-y-2">
                  <h3 className="font-headline font-semibold flex items-center gap-2">Insights</h3>
                  <div className="text-sm prose prose-slate max-w-none prose-sm leading-relaxed whitespace-pre-line">
                    {result.insights}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline font-semibold flex items-center gap-2 text-accent-foreground bg-accent/20 px-3 py-1 rounded-full w-fit">Recomendações</h3>
                  <div className="text-sm font-medium leading-relaxed bg-accent/5 p-3 rounded-lg border border-accent/20 whitespace-pre-line">
                    {result.recommendations}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button className="w-full" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}