
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateACGuide } from "@/ai/flows/generate-ac-guide";
import { Loader2, AlertCircle, Sparkles, ClipboardList, Wind } from "lucide-react";
import { checkLimit, incrementUsage } from "@/app/lib/usage-limits";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { saveAnalysis } from "@/app/lib/history-store";

interface ACMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ACMaintenanceModal({ isOpen, onClose }: ACMaintenanceModalProps) {
  const [formData, setFormData] = useState({
    brand: "",
    btus: "",
    guideType: "manutenção_preventiva" as any
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [limitStatus, setLimitStatus] = useState({ allowed: true, remaining: 0 });

  const db = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (isOpen) {
      setLimitStatus(checkLimit('guides', user?.isAnonymous || false));
    }
  }, [isOpen, user]);

  const handleGenerate = async () => {
    if (!formData.brand || !formData.btus || !user) return;

    const { allowed } = checkLimit('guides', user.isAnonymous);
    if (!allowed) {
      setError("Limite de guias atingido hoje! ❄️");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const output = await generateACGuide(formData as any);
      setResult(output);

      const guidesRef = collection(db, "users", user.uid, "maintenanceGuides");
      addDocumentNonBlocking(guidesRef, {
        userId: user.uid,
        unitData: formData,
        guide: output,
        createdAt: serverTimestamp(),
      });

      saveAnalysis({
        type: 'guide',
        input: `Guia ${formData.guideType} - ${formData.brand}`,
        output: output
      });

      incrementUsage('guides');
      setLimitStatus(checkLimit('guides', user.isAnonymous));
    } catch (err) {
      setError("Não foi possível gerar o guia técnico agora.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setFormData({ brand: "", btus: "", guideType: "manutenção_preventiva" });
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
                  Guia <span className="animate-text-flash italic inline-block pr-2">Técnico</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-bold text-[9px] uppercase tracking-[0.2em]">
                  Personalização Avançada via Clima IA
                </DialogDescription>
              </div>
              <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-primary">
                {limitStatus.remaining} restantes
              </div>
            </div>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-[1.25rem]">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold text-[9px] uppercase tracking-widest">Aviso</AlertTitle>
              <AlertDescription className="text-[10px] font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {!result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Marca do Equipamento</Label>
                  <Input 
                    placeholder="Ex: LG, Samsung, Midea..." 
                    className="h-10 bg-background border-border rounded-[1rem] px-5 focus:ring-primary border-2 transition-all text-sm"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Capacidade (BTUs)</Label>
                  <Input 
                    placeholder="Ex: 9.000, 12.000..." 
                    className="h-10 bg-background border-border rounded-[1rem] px-5 focus:ring-primary border-2 transition-all text-sm"
                    value={formData.btus}
                    onChange={(e) => setFormData({...formData, btus: e.target.value})}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground ml-3">Tipo de Protocolo</Label>
                  <Select 
                    value={formData.guideType} 
                    onValueChange={(value) => setFormData({...formData, guideType: value})}
                  >
                    <SelectTrigger className="h-10 bg-background border-border rounded-[1rem] px-5 focus:ring-primary border-2 text-sm">
                      <SelectValue placeholder="Selecione o guia" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground rounded-xl">
                      <SelectItem value="instalação">Manual de Instalação</SelectItem>
                      <SelectItem value="higienização">Protocolo de Higienização</SelectItem>
                      <SelectItem value="manutenção_preventiva">Manutenção Preventiva (PMOC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full h-12 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/10 transition-all active:scale-[0.98]" 
                onClick={handleGenerate}
                disabled={isLoading || !formData.brand || !formData.btus}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {isLoading ? "Processando Protocolo..." : "Gerar Guia Especializado"}
              </Button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none rounded-[1.5rem]" />
                <div className="relative z-10 bg-background/50 p-6 md:p-8 rounded-[1.5rem] border-2 border-primary/20 space-y-6">
                  <div className="space-y-1 border-b border-border pb-4">
                    <h3 className="text-xl font-headline font-bold text-foreground uppercase tracking-tighter">
                      {result.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                        <ClipboardList className="w-2.5 h-2.5" />
                        Passo a Passo Técnico
                      </h4>
                      <p className="text-[12px] text-muted-foreground leading-relaxed whitespace-pre-line font-medium bg-background p-5 rounded-2xl border border-border">
                        {result.steps}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <h5 className="text-[8px] font-black uppercase tracking-widest mb-2">Ferramentas</h5>
                        <p className="text-[10px] font-medium opacity-80">{result.toolsNeeded}</p>
                      </div>
                      <div className="p-4 bg-accent rounded-2xl border border-border">
                        <h5 className="text-[8px] font-black uppercase tracking-widest mb-2">Dica de Performance</h5>
                        <p className="text-[10px] font-medium opacity-80">{result.performanceTips}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-[1rem] text-[9px] font-black uppercase tracking-[0.3em]" 
                onClick={handleClose}
              >
                Fechar Protocolo
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
