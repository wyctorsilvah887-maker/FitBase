"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

type GuideType = 'saude' | 'adestramento' | 'nutricao';

export function CareGuideModal({ isOpen, onClose, onSuccess }: CareGuideModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    guideType: "nutricao" as GuideType
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
      // O fluxo Genkit ainda aceita 'cuidados', mas não ofereceremos mais no formulário
      const output = await generateCareGuide(formData as any);
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
    setFormData({ name: "", species: "", breed: "", age: "", guideType: "nutricao" });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto bg-black border-zinc-900 text-white p-0 rounded-[2.5rem] outline-none custom-scrollbar">
        <div className="p-6 md:p-10 space-y-8">
          <DialogHeader className="text-left relative space-y-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <DialogTitle className="text-2xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-tight">
                  Manual de <span className="animate-text-flash italic inline-block pr-2">Bem-estar</span>
                </DialogTitle>
                <DialogDescription className="text-zinc-500 font-bold text-[9px] uppercase tracking-[0.2em]">
                  Personalização avançada via IA
                </DialogDescription>
              </div>
              <div className="bg-primary/5 border border-primary/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
                {limitStatus.remaining} restantes
              </div>
            </div>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-[1.25rem] animate-in fade-in zoom-in">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold text-[9px] uppercase tracking-widest">Aviso</AlertTitle>
              <AlertDescription className="text-[10px] font-medium opacity-80">{error}</AlertDescription>
            </Alert>
          )}

          {!result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-zinc-600 ml-3">Nome do Pet</Label>
                  <Input 
                    placeholder="Ex: Totó" 
                    className="h-10 bg-zinc-950 border-zinc-800 rounded-[1rem] px-5 focus:ring-primary border-2 transition-all placeholder:text-zinc-800 text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!limitStatus.allowed}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-zinc-600 ml-3">Espécie</Label>
                  <Input 
                    placeholder="Ex: Cão, Gato..." 
                    className="h-10 bg-zinc-950 border-zinc-800 rounded-[1rem] px-5 focus:ring-primary border-2 transition-all placeholder:text-zinc-800 text-sm"
                    value={formData.species}
                    onChange={(e) => setFormData({...formData, species: e.target.value})}
                    disabled={!limitStatus.allowed}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-zinc-600 ml-3">Raça</Label>
                  <Input 
                    placeholder="Ex: Golden, SRD..." 
                    className="h-10 bg-zinc-950 border-zinc-800 rounded-[1rem] px-5 focus:ring-primary border-2 transition-all placeholder:text-zinc-800 text-sm"
                    value={formData.breed}
                    onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    disabled={!limitStatus.allowed}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-zinc-600 ml-3">Idade</Label>
                  <Input 
                    placeholder="Ex: 2 anos" 
                    className="h-10 bg-zinc-950 border-zinc-800 rounded-[1rem] px-5 focus:ring-primary border-2 transition-all placeholder:text-zinc-800 text-sm"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    disabled={!limitStatus.allowed}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-[9px] uppercase font-black tracking-[0.25em] text-zinc-600 ml-3">Tipo de Guia</Label>
                  <Select 
                    value={formData.guideType} 
                    onValueChange={(value) => setFormData({...formData, guideType: value as GuideType})}
                    disabled={!limitStatus.allowed}
                  >
                    <SelectTrigger className="h-10 bg-zinc-950 border-zinc-800 rounded-[1rem] px-5 focus:ring-primary border-2 text-sm">
                      <SelectValue placeholder="Selecione o foco" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-900 text-white rounded-xl">
                      <SelectItem value="nutricao" className="focus:bg-primary/20">Nutrição</SelectItem>
                      <SelectItem value="saude" className="focus:bg-primary/20">Saúde & Prevenção</SelectItem>
                      <SelectItem value="adestramento" className="focus:bg-primary/20">Adestramento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.guideType === 'saude' && (
                  <div className="sm:col-span-2 px-4 py-3 bg-primary/10 border border-primary/20 rounded-2xl animate-in fade-in zoom-in slide-in-from-top-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.15em] text-center leading-relaxed">
                      🐾 Módulo de Saúde & Prevenção:<br />Disponível em breve para assinantes premium.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <Button 
                  className="w-full h-12 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-black hover:bg-primary/90 disabled:opacity-30 shadow-xl shadow-primary/10 transition-all active:scale-[0.98]" 
                  onClick={handleGenerate}
                  disabled={isLoading || !formData.name || !formData.species || !limitStatus.allowed || formData.guideType === 'saude'}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {formData.guideType === 'saude' ? "Módulo em Breve" : isLoading ? "Gerando..." : "Criar Guia Premium"}
                </Button>
                <p className="text-center mt-4 text-[8px] font-bold text-zinc-700 uppercase tracking-widest flex items-center justify-center gap-2">
                  <PawPrint className="w-2.5 h-2.5" />
                  WS Studios Veterinary AI
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none rounded-[1.5rem]"></div>
                <div className="relative z-10 bg-zinc-950 p-6 md:p-8 rounded-[1.5rem] border-2 border-primary/20 space-y-8">
                  <div className="space-y-1 border-b border-zinc-900 pb-4">
                    <h3 className="text-xl font-headline font-bold text-white uppercase tracking-tighter">
                      {result.guideTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                        <ClipboardList className="w-2.5 h-2.5" />
                        Foco Principal
                      </h4>
                      <p className="text-[12px] text-zinc-400 leading-relaxed whitespace-pre-line font-medium">
                        {result.essentialCare}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                        <Sparkles className="w-2.5 h-2.5" />
                        Sugestões Vet IA
                      </h4>
                      <p className="text-[12px] text-zinc-400 leading-relaxed whitespace-pre-line font-medium">
                        {result.nutritionTips}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-900">
                    <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl space-y-2">
                      <h4 className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Alertas de Saúde</h4>
                      <p className="text-[11px] font-bold text-white leading-relaxed whitespace-pre-line">
                        {result.healthAlerts}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 rounded-[1rem] text-[9px] font-black uppercase tracking-[0.3em] border-zinc-800 hover:bg-zinc-900 transition-all" 
                onClick={handleClose}
              >
                Concluir
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
