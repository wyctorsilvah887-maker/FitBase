"use client";

import { useEffect, useState } from "react";
import { AnalysisEntry, getHistory, clearHistory } from "@/app/lib/history-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, FileText, ImageIcon, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryListProps {
  onSelect: (entry: AnalysisEntry) => void;
  refreshTrigger: number;
}

export function HistoryList({ onSelect, refreshTrigger }: HistoryListProps) {
  const [history, setHistory] = useState<AnalysisEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, [refreshTrigger]);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-headline font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Histórico Recente
        </h2>
        <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Limpar
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((entry) => (
          <Card 
            key={entry.id} 
            className="cursor-pointer hover:shadow-md transition-shadow group overflow-hidden border-teal-100"
            onClick={() => onSelect(entry)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-secondary/50">
                  {entry.type === 'text' ? (
                    <FileText className="w-4 h-4 text-primary" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    {format(entry.timestamp, "d 'de' MMMM, HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-sm font-medium line-clamp-2 mb-1">
                    {entry.type === 'text' ? entry.input : "Análise de Imagem"}
                  </p>
                  <div className="flex items-center text-xs text-primary font-medium group-hover:translate-x-1 transition-transform">
                    Ver resultado <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}