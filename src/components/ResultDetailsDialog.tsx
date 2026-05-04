
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AnalysisEntry } from "@/app/lib/history-store";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Sparkles, ClipboardList, ShieldCheck } from "lucide-react";
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
  const isImage = entry.type === 'image';
  const isGuide = entry.type === 'guide';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-zinc-900 text-white p-0 rounded-[2.5rem] outline-none custom-scrollbar shadow-2xl">
        <div className="p-6 md:p-10 space-y-8">
          <DialogHeader className="text-left relative space-y-2">
            <div className="space-y-1">
              <DialogTitle className="text-2xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-tight">
                {isGuide ? (
                  <>Manual <span className="animate-text-flash italic">Salvo</span></>
                ) : (
                  <>Relatório <span className="animate-text-flash italic">IA</span></>
                )}
              </DialogTitle>
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                <Calendar className="w-2.5 h-2.5" />
                {format(entry.timestamp, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-8">
            {/* Seção de Entrada */}
            <div className="space-y-3">
              <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-2">Dados de Entrada</h3>
              {isImage ? (
                <div className="relative w-full aspect-video rounded-[1.5rem] overflow-hidden border-2 border-zinc-900 group">
                  <img src={entry.input} alt="Análise de entrada" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                </div>
              ) : (
                <div className="bg-zinc-950 p-6 rounded-[1.5rem] border-2 border-zinc-900 italic text-zinc-400 text-sm leading-relaxed">
                  "{entry.input}"
                </div>
              )}
            </div>

            {/* Seção de Resultado IA */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none rounded-[2rem]"></div>
              <div className="relative z-10 bg-zinc-950 p-6 md:p-8 rounded-[2rem] border-2 border-primary/20 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                    <Sparkles className="w-2.5 h-2.5" />
                    {isGuide ? result.guideTitle : "Análise Preventiva"}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-300 font-medium whitespace-pre-line border-l-2 border-primary/30 pl-4">
                    {isGuide ? result.essentialCare : result.analysisSummary || result.analysis}
                  </p>
                </div>

                {!isGuide && result.insights && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-900">
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Insights</h4>
                      <div className="text-[11px] text-zinc-500 leading-relaxed whitespace-pre-line bg-black/40 p-4 rounded-xl border border-zinc-900">
                        {result.insights}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Recomendações</h4>
                      <div className="text-[11px] font-bold leading-relaxed text-white bg-primary/5 p-4 rounded-xl border border-primary/10 whitespace-pre-line">
                        {result.recommendations}
                      </div>
                    </div>
                  </div>
                )}

                {isGuide && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-900">
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Dicas de Nutrição</h4>
                      <div className="text-[11px] text-zinc-500 leading-relaxed whitespace-pre-line bg-black/40 p-4 rounded-xl border border-zinc-900">
                        {result.nutritionTips}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Alertas de Saúde</h4>
                      <div className="text-[11px] font-bold leading-relaxed text-white bg-primary/5 p-4 rounded-xl border border-primary/10 whitespace-pre-line">
                        {result.healthAlerts}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-center text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                Dados Protegidos • Protocolo WS Studios
              </p>
              <Button 
                className="w-full h-12 rounded-[1rem] text-[9px] font-black uppercase tracking-[0.3em] bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 transition-all" 
                onClick={onClose}
              >
                Fechar Histórico
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
