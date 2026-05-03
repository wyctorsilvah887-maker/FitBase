"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateCareGuide } from "@/ai/flows/generate-care-guide";
import { Loader2, AlertCircle, Sparkles, ClipboardList } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CareGuideModal({ isOpen, onClose }: CareGuideModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!formData.name || !formData.species) return;
    setIsLoading(true);
    setError(null);
    try {
      const output = await generateCareGuide(formData);
      setResult(output);
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
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-900 text-white p-0 rounded-[2.5rem] outline-none custom-scrollbar">
        <div className="p-8 md:p-12 space-y-8">
          <DialogHeader className="text-left">
            <DialogTitle className="text-3xl md:text-4xl font-headline font-black tracking-tighter uppercase">
              Guia de Cuidados
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium text-sm md:text-base mt-2">
              Personalize o bem-estar do seu pet com a IA.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-bold">Erro</AlertTitle>
              <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {!result ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-2">Nome do Pet</Label>
                  <Input 
                    placeholder="Ex: Totó" 
                    className="h-14 bg-zinc-900/50 border-zinc-800 rounded-2xl px-6 focus:ring-primary"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-2">Espécie</Label>
                  <Input 
                    placeholder="Ex: Cão, Gato..." 
                    className="h-14 bg-zinc-900/50 border-zinc-800 rounded-2xl px-6 focus:ring-primary"
                    value={formData.species}
                    onChange={(e) => setFormData({...formData, species: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-2">Raça</Label>
                  <Input 
                    placeholder="Ex: Golden, SRD..." 
                    className="h-14 bg-zinc-900/50 border-zinc-800 rounded-2xl px-6 focus:ring-primary"
                    value={formData.breed}
                    onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-2">Idade Aproximada</Label>
                  <Input 
                    placeholder="Ex: 2 anos" 
                    className="h-14 bg-zinc-900/50 border-zinc-800 rounded-2xl px-6 focus:ring-primary"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
              </div>
              <Button 
                className="w-full h-16 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] bg-primary text-black hover:bg-primary/90 disabled:opacity-30 mt-4" 
                onClick={handleGenerate}
                disabled={isLoading || !formData.name || !formData.species}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                ) : (
                  <ClipboardList className="w-5 h-5 mr-3" />
                )}
                {isLoading ? "Gerando Guia..." : "Gerar Guia Personalizado"}
              </Button>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">
                  {result.guideTitle}
                </h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2">Cuidados Essenciais</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
                      {result.essentialCare}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2">Dicas de Nutrição</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
                      {result.nutritionTips}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">Alertas de Saúde</h4>
                    <p className="text-sm font-bold text-white bg-primary/10 p-6 rounded-2xl border border-primary/20 whitespace-pre-line">
                      {result.healthAlerts}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-900">
                <Button variant="outline" className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-zinc-800 hover:bg-zinc-900" onClick={handleClose}>
                  Fechar Guia
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
