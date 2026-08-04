
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { Loader2, Calendar, Wrench, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TechnicianScheduleModalProps {
  technician: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TechnicianScheduleModal({ technician, isOpen, onClose }: TechnicianScheduleModalProps) {
  const { user } = useUser();
  const db = useFirestore();

  const scheduleQuery = useMemoFirebase(() => {
    if (!user || !db || !technician) return null;
    return query(
      collection(db, "users", user.uid, "serviceOrders"),
      where("technicianId", "==", technician.id),
      orderBy("date", "desc")
    );
  }, [user, db, technician]);

  const { data: schedule, isLoading } = useCollection(scheduleQuery);

  const statusConfig: any = {
    pendente: { label: "Pendente", color: "bg-amber-500/10 text-amber-600 border-amber-600/20", icon: <Clock className="w-3 h-3" /> },
    em_andamento: { label: "Executando", color: "bg-blue-500/10 text-blue-600 border-blue-600/20", icon: <Wrench className="w-3 h-3" /> },
    concluido: { label: "Concluído", color: "bg-emerald-500/10 text-emerald-600 border-emerald-600/20", icon: <CheckCircle2 className="w-3 h-3" /> },
    cancelado: { label: "Cancelado", color: "bg-red-500/10 text-red-600 border-red-600/20", icon: <Calendar className="w-3 h-3" /> },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-xl bg-card border-border text-foreground p-0 rounded-[2.5rem] outline-none shadow-2xl">
        <div className="p-8 md:p-10 space-y-8">
          <DialogHeader className="text-left space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-2xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-tight">
                  Escala de <span className="animate-text-flash italic">{technician?.name.split(' ')[0]}</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-bold text-[9px] uppercase tracking-[0.2em]">
                  Agenda Técnica WS Studios Company
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sincronizando Escala...</p>
              </div>
            ) : schedule && schedule.length > 0 ? (
              <div className="space-y-4">
                {schedule.map((os) => {
                  const config = statusConfig[os.status] || statusConfig.pendente;
                  return (
                    <div key={os.id} className="p-5 rounded-2xl bg-background border-2 border-border hover:border-primary/20 transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest border-2 px-3 py-1 gap-2 ${config.color}`}>
                          {config.icon} {config.label}
                        </Badge>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{new Date(os.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-headline font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{os.customerName}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          <Wrench className="w-3 h-3 text-primary" /> {os.equipment} • {os.btus}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center opacity-50">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nenhuma atividade agendada</p>
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mt-1">Este técnico está disponível para novas OS</p>
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="pt-2 border-t border-border">
             <p className="text-[8px] font-black text-center text-muted-foreground uppercase tracking-[0.3em] italic">
                A escala é atualizada automaticamente em tempo real via Clima IA Security
             </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
