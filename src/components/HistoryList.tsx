
"use client";

import { useMemoFirebase, useCollection, useUser, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ClipboardList, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { ResultDetailsDialog } from "@/components/ResultDetailsDialog";

interface HistoryListProps {
  refreshTrigger: number;
}

export function HistoryList({ refreshTrigger }: HistoryListProps) {
  const { user } = useUser();
  const db = useFirestore();
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  // Memoize as consultas para evitar re-renderizações infinitas
  const textAnalysesQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "users", user.uid, "textAnalyses"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
  }, [user, db, refreshTrigger]);

  const careGuidesQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "users", user.uid, "careGuides"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
  }, [user, db, refreshTrigger]);

  const { data: textAnalyses, isLoading: loadingText } = useCollection(textAnalysesQuery);
  const { data: careGuides, isLoading: loadingGuides } = useCollection(careGuidesQuery);

  const combinedHistory = useMemoFirebase(() => {
    const list = [
      ...(textAnalyses || []).map(a => ({ ...a, type: 'text' })),
      ...(careGuides || []).map(g => ({ ...g, type: 'guide' }))
    ];
    return list.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  }, [textAnalyses, careGuides]);

  if (loadingText || loadingGuides) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (combinedHistory.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-900/20 rounded-[2rem] border border-white/5">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Nenhum registro encontrado ainda 🐾</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {combinedHistory.map((entry) => (
          <Card 
            key={entry.id} 
            className="group cursor-pointer bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-800/50 transition-all rounded-3xl overflow-hidden border-2"
            onClick={() => setSelectedEntry(entry)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl ring-1 ring-primary/20">
                  {entry.type === 'text' ? (
                    <FileText className="w-5 h-5 text-primary" />
                  ) : (
                    <ClipboardList className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                    {entry.type === 'text' ? 'Análise de Sintomas' : 'Guia de Cuidados'}
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-zinc-500">
                      {entry.createdAt?.toDate?.().toLocaleDateString('pt-BR') || 'Recente'}
                    </span>
                  </h4>
                  <p className="text-xs font-bold text-white truncate">
                    {entry.type === 'text' ? entry.inputText : `Guia para ${entry.petData?.name}`}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ResultDetailsDialog 
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry ? {
          ...selectedEntry,
          input: selectedEntry.type === 'text' ? selectedEntry.inputText : `Dados de ${selectedEntry.petData?.name}`,
          output: selectedEntry.type === 'text' ? selectedEntry.aiResponse : selectedEntry.guide,
          timestamp: selectedEntry.createdAt?.toDate?.().getTime() || Date.now()
        } : null}
      />
    </>
  );
}
