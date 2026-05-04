"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateCareGuide } from "@/ai/flows/generate-care-guide";
import { Loader2, AlertCircle, Sparkles, ClipboardList, PawPrint } from "lucide-react";
import { checkLimit, incrementUsage } from "@/app/lib/usage-limits";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";

interface CareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CareGuideModal({ isOpen, onClose, onSuccess }: CareGuideModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [limitStatus, setLimitStatus] = useState({ allowed: true, remaining: 0 });

  const db = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (isOpen) {
      setLimitStatus(checkLimit('guides'));
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (!formData.name || !formData.species || !user) return;

    const { allowed } = checkLimit('guides');
    if (!allowed) {
      setError("Você atingiu o limite de 2 guias hoje. Volte amanhã para cuidar do seu pet! 🐾");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const output = await generateCareGuide(formData);
      setResult(output);

      const guidesRef = collection(db, "users", user.uid, "careGuides");
      addDocumentNonBlocking(guidesRef, {
        userId: user.uid,
        petData: formData,
        guide: output,
        createdAt: serverTimestamp(),
      });

      incrementUsage('guides');
      setLimitStatus(checkLimit('guides'));
      onSuccess?.();
    } catch (err) {
      setError("Não foi possível gerar o guia agora. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setFormData({ name: "", species: "", breed: "", age: "" });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-zinc-900 text-white p-0 rounded-[2.5rem] outline-none custom-scrollbar">
        <div className="p-8 md:p-12 space-y-10">
          <DialogHeader className="text-left relative space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <DialogTitle className="text-3xl md:text-4xl font-headline font-black tracking-tighter uppercase">
                  Manual de <span className="animate-text-flash italic">Bem-estar</span>
                </DialogTitle>
                <DialogDescription className="text-zinc-500 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em] mt-2">
                  Personalização avançada via inteligência artificial
                </DialogDescription>
              </div>
              <div className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
                {limitStatus.remaining} restantes
              </div>
            </div>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-[1.5rem] animate-in fade-in zoom-in">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-bold text-[10px] uppercase tracking-widest">Limite Atingido</AlertTitle>
              <AlertDescription className="text-[11px] font-medium opacity-80">{error}</AlertDescription>
            </Alert>
          )}

          {!result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-black tracking-[0.25em] text-zinc-600 ml-4">Nome do Pet</Label>
                  <div className="relative group">
                    <Input 
                      placeholder="Ex: Totó" 
                      className="h-16 bg-zinc-950 border-zinc-800 rounded-[1.25rem] px-8 focus:ring-primary border-2 transition-all placeholder:text-zinc-800"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!limitStatus.allowed}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-black tracking-[0.25em] text-zinc-600 ml-4">Espécie</Label>
                  <Input 
                    placeholder="Ex: Cão, Gato..." 
                    className="h-16 bg-zinc-950 border-zinc-800 rounded-[1.25rem] px-8 focus:ring-primary border-2 transition-all placeholder:text-zinc-800"
                    value={formData.species}
                    onChange={(e) => setFormData({...formData, species: e.target.value})}
                    disabled={!limitStatus.allowed}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-black tracking-[0.25em] text-zinc-600 ml-4">Raça</Label>
                  <Input 
                    placeholder="Ex: Golden, SRD..." 
                    className="h-16 bg-zinc-950 border-zinc-800 rounded-[1.25rem] px-8 focus:ring-primary border-2 transition-all placeholder:text-zinc-800"
                    value={formData.breed}
                    onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    disabled={!limitStatus.allowed}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-black tracking-[0.25em] text-zinc-600 ml-4">Idade Aproximada</Label>
                  <Input 
                    placeholder="Ex: 2 anos" 
                    className="h-16 bg-zinc-950 border-zinc-800 rounded-[1.25rem] px-8 focus:ring-primary border-2 transition-all placeholder:text-zinc-800"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    disabled={!limitStatus.allowed}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full h-18 py-8 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] bg-primary text-black hover:bg-primary/90 disabled:opacity-30 shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]" 
                  onClick={handleGenerate}
                  disabled={isLoading || !formData.name || !formData.species || !limitStatus.allowed}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  ) : (
                    <Sparkles className="w-5 h-5 mr-3" />
                  )}
                  {isLoading ? "Processando Dados..." : "Gerar Guia Premium"}
                </Button>
                <p className="text-center mt-6 text-[9px] font-bold text-zinc-700 uppercase tracking-widest flex items-center justify-center gap-2">
                  <PawPrint className="w-3 h-3" />
                  Powered by WS Studios Veterinary AI
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none rounded-[2rem]"></div>
                <div className="relative z-10 bg-zinc-950 p-8 md:p-10 rounded-[2rem] border-2 border-primary/20 space-y-10">
                  <div className="space-y-2 border-b border-zinc-900 pb-6">
                    <h3 className="text-2xl font-headline font-bold text-white uppercase tracking-tighter">
                      {result.guideTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                        <ClipboardList className="w-3 h-3" />
                        Cuidados Essenciais
                      </h4>
                      <p className="text-[13px] text-zinc-400 leading-relaxed whitespace-pre-line font-medium">
                        {result.essentialCare}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Dicas Nutricionais
                      </h4>
                      <p className="text-[13px] text-zinc-400 leading-relaxed whitespace-pre-line font-medium">
                        {result.nutritionTips}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900">
                    <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl space-y-3">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Alertas de Saúde Preventiva</h4>
                      <p className="text-[12px] font-bold text-white leading-relaxed whitespace-pre-line">
                        {result.healthAlerts}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <div className="flex flex-col items-center gap-2 text-center opacity-40">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">
                    Informações arquivadas em seu histórico seguro
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full h-16 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.3em] border-zinc-800 hover:bg-zinc-900 transition-all" 
                  onClick={handleClose}
                >
                  Concluir e Fechar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}