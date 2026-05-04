'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, PawPrint } from 'lucide-react';
import Header from '@/components/Header';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-body overflow-x-hidden">
      <div className="bg-noise" />
      <Header />
      
      <main className="relative z-10 container mx-auto px-6 py-12 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-12 -ml-4 gap-2 text-zinc-500 hover:text-primary hover:bg-white/5 rounded-full transition-all group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
          <span className="text-[10px] font-black uppercase tracking-widest">Retornar</span>
        </Button>

        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center text-center space-y-6 mb-16">
            <div className="bg-black border-2 border-primary/20 p-5 rounded-[2rem] shadow-2xl shadow-primary/5 animate-icon-flash relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
               <ShieldCheck className="h-10 w-10 text-primary relative z-10" />
            </div>
            <div className="space-y-2">
              <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                Termos de <span className="animate-text-flash italic inline-block pr-2">Uso</span>
              </h1>
              <p className="text-[9px] uppercase font-black tracking-[0.4em] text-zinc-600">
                WS Studios • Protocolo Veterinário • v2026.1
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Clause Card 01 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none rounded-[2rem]" />
              <div className="relative z-10 bg-black border border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-primary/20 transition-all">
                <h2 className="text-lg font-headline font-bold text-white flex items-center gap-3">
                  <span className="text-primary italic text-2xl font-black tracking-tighter">01.</span> 
                  <span className="uppercase tracking-tight">Tecnologia e Desenvolvimento</span>
                </h2>
                <p className="text-sm leading-relaxed text-zinc-500 font-medium">
                  O Vet IA é uma ferramenta de inteligência artificial desenvolvida pela WS Studios para auxílio na prevenção de doenças e educação nutricional. O usuário declara estar ciente de que a IA encontra-se em desenvolvimento constante e, devido à sua natureza experimental, podem ocorrer imprecisões técnicas temporárias.
                </p>
              </div>
            </div>

            {/* Clause Card 02 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none rounded-[2rem]" />
              <div className="relative z-10 bg-black border border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-primary/20 transition-all">
                <h2 className="text-lg font-headline font-bold text-white flex items-center gap-3">
                  <span className="text-primary italic text-2xl font-black tracking-tighter">02.</span> 
                  <span className="uppercase tracking-tight">Responsabilidade do Tutor</span>
                </h2>
                <p className="text-sm leading-relaxed text-zinc-500 font-medium">
                  O usuário compreende que as sugestões da Vet IA não substituem, em hipótese alguma, a avaliação de um médico veterinário presencial. Em situações de emergência ou sintomas graves, o tutor deve procurar atendimento profissional imediato para garantir a segurança do pet.
                </p>
              </div>
            </div>

            {/* Clause Card 03 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none rounded-[2rem]" />
              <div className="relative z-10 bg-black border border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-primary/20 transition-all">
                <h2 className="text-lg font-headline font-bold text-white flex items-center gap-3">
                  <span className="text-primary italic text-2xl font-black tracking-tighter">03.</span> 
                  <span className="uppercase tracking-tight">Privacidade e Dados</span>
                </h2>
                <p className="text-sm leading-relaxed text-zinc-500 font-medium">
                  Os dados enviados e o conteúdo das interações são utilizados para o processamento da IA e armazenamento de histórico preventivo. A WS Studios garante o tratamento seguro dos dados conforme a LGPD, utilizando-os para o treinamento e aprimoramento de futuros modelos de inteligência artificial.
                </p>
              </div>
            </div>

            {/* Clause Card 04 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none rounded-[2rem]" />
              <div className="relative z-10 bg-black border border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-primary/20 transition-all">
                <h2 className="text-lg font-headline font-bold text-white flex items-center gap-3">
                  <span className="text-primary italic text-2xl font-black tracking-tighter">04.</span> 
                  <span className="uppercase tracking-tight">Limitações de Acesso</span>
                </h2>
                <p className="text-sm leading-relaxed text-zinc-500 font-medium">
                  O sistema possui um limite diário de mensagens para garantir a estabilidade e qualidade do serviço para toda a comunidade. Tentativas de burlar o sistema ou utilizar a tecnologia para fins não previstos nestes termos podem resultar na suspensão da conta do usuário.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-white/5 text-center">
            <div className="flex items-center justify-center space-x-3 opacity-30 group cursor-default mb-6">
              <PawPrint className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-headline text-lg font-bold tracking-tighter text-white">
                Vet <span className="text-primary italic">IA</span>
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">
              Tecnologia Desenvolvida por <span className="animate-text-flash italic inline-block">WS Studios</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}