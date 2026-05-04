"use client";

import { useMemoFirebase, useCollection, useUser, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, ChevronRight, Loader2, History } from "lucide-react";
import { useState } from "react";
import { ResultDetailsDialog } from "@/components/ResultDetailsDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HistoryListProps {
  refreshTrigger: number;
}

export function HistoryList({ refreshTrigger }: HistoryListProps) {
  const { user } = useUser();
  const db = useFirestore();
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [activeSweepId, setActiveSweepId] = useState<string | null>(null);

  const careGuidesQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "users", user.uid, "careGuides"),
      orderBy("createdAt", "desc"),
      limit(3)
    );
  }, [user, db, refreshTrigger]);

  const { data: careGuides, isLoading: loadingGuides } = useCollection(careGuidesQuery);

  const handleEntryClick = (entry: any) => {
    if (activeSweepId) return;
    setActiveSweepId(entry.id);
    setTimeout(() => {
      setActiveSweepId(null);
      setSelectedEntry(entry);
    }, 600);
  };

  if (loadingGuides) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!careGuides || careGuides.length === 0) {
    return (
      <div className="text-center py-12 bg-black rounded-[2rem] border border-white/5">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Nenhum guia de cuidados encontrado ainda 🐾</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {careGuides.map((entry) => (
            <Card 
              key={entry.id} 
              className="group cursor-pointer relative bg-black border-zinc-800/50 hover:bg-zinc-900/20 transition-all rounded-3xl overflow-hidden border-2"
              onClick={() => handleEntryClick(entry)}
            >
              {/* Sweep Animation Effect */}
              {activeSweepId === entry.id && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-sweep" />
                </div>
              )}

              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl ring-1 ring-primary/20">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                      Guia de Cuidados
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="text-zinc-500">
                        {entry.createdAt?.toDate?.().toLocaleDateString('pt-BR') || 'Recente'}
                      </span>
                    </h4>
                    <p className="text-xs font-bold text-white truncate">
                      Guia para {entry.petData?.name}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">
            Exibindo os 3 guias mais recentes. O restante está guardado em seu banco de dados.
          </p>
          <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors cursor-default opacity-50">
            <History className="w-3 h-3 mr-2" />
            Ver histórico completo em breve
          </Button>
        </div>
      </div>

      <ResultDetailsDialog 
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry ? {
          ...selectedEntry,
          type: 'guide',
          input: `Dados de ${selectedEntry.petData?.name}`,
          output: selectedEntry.guide,
          timestamp: selectedEntry.createdAt?.toDate?.().getTime() || Date.now()
        } : null}
      />
    </>
  );
}
