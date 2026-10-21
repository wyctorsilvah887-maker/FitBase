'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Dumbbell, Scale } from 'lucide-react';
import Header from '@/components/Header';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-body overflow-x-hidden">
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-8 -ml-2 gap-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-full transition-all group h-8"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> 
          <span className="text-[9px] font-black uppercase tracking-widest">Retornar</span>
        </Button>

        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <div className="bg-card border-2 border-primary/20 p-4 rounded-[1.5rem] shadow-2xl shadow-primary/5 animate-icon-flash relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
               <Scale className="h-8 w-8 text-primary relative z-10" />
            </div>
            <div className="space-y-1">
              <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter uppercase leading-none">
                Instrumento Particular de <span className="animate-text-flash italic inline-block pr-2">Termos de Uso</span>
              </h1>
              <p className="text-[8px] md:text-[9px] uppercase font-black tracking-[0.3em] text-muted-foreground">
                WS Studios Company • FitBase • Versão 2026.1.Legal
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            <div className="bg-card border border-border p-8 rounded-[2rem] space-y-6">
              <div className="space-y-4 text-xs md:text-sm leading-relaxed text-muted-foreground text-justify font-medium">
                <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="text-primary italic text-xl">01.</span> Natureza do Serviço
                </h2>
                <p>
                  O <strong>FitBase</strong>, desenvolvido e operado pela <strong>WS Studios Company</strong>, é uma plataforma de Software como Serviço (SaaS) destinada exclusivamente à organização administrativa e registro de dados internos de estabelecimentos fitness (academias, estúdios, boxes). A plataforma funciona como um livro de registro digital (ledger), não possuindo funções de instituição bancária, processadora de pagamentos ou consultoria médica/esportiva.
                </p>

                <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-2 pt-4">
                  <span className="text-primary italic text-xl">02.</span> Responsabilidade pelo Conteúdo e Dados
                </h2>
                <p>
                  O Usuário (Gestor da Academia) declara ser o único e exclusivo responsável pela veracidade, integridade e legalidade de todos os dados inseridos na plataforma. O FitBase atua tecnicamente como <strong>Operador de Dados</strong> nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), cabendo ao Usuário a condição de <strong>Controlador</strong>, sendo de sua inteira responsabilidade a obtenção do consentimento prévio e expresso de seus alunos para o tratamento de dados pessoais.
                </p>

                <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-2 pt-4">
                  <span className="text-primary italic text-xl">03.</span> Limitação de Responsabilidade Jurídica
                </h2>
                <p>
                  A WS Studios Company não será responsabilizada por: (i) Erros de lançamentos financeiros realizados pelo Usuário; (ii) Eventuais lesões, danos físicos ou óbitos ocorridos nas dependências do estabelecimento do Usuário; (iii) Inadimplência contratual entre o aluno e o Usuário; (iv) Interrupções de serviço decorrentes de falhas técnicas globais da infraestrutura de internet ou serviços de terceiros (Firebase/Google Cloud).
                </p>

                <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-2 pt-4">
                  <span className="text-primary italic text-xl">04.</span> Inexistência de Consultoria Profissional
                </h2>
                <p>
                  A plataforma FitBase fornece ferramentas de automatização e análise estratégica de negócios baseada em Inteligência Artificial. Tais análises são sugestivas e não substituem o parecer técnico de contadores, advogados ou profissionais de educação física. O Usuário assume todo o risco comercial ao implementar estratégias sugeridas pela plataforma.
                </p>

                <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-2 pt-4">
                  <span className="text-primary italic text-xl">05.</span> Propriedade Intelectual e Uso Indevido
                </h2>
                <p>
                  Todo o código-fonte, design, logotipos e algoritmos da plataforma são propriedade intelectual da WS Studios Company. É estritamente proibida a engenharia reversa, cópia ou uso da ferramenta para atividades ilícitas, sob pena de rescisão imediata do acesso e interpelação judicial por danos morais e lucros cessantes.
                </p>

                <h2 className="text-foreground font-black uppercase tracking-widest flex items-center gap-2 pt-4">
                  <span className="text-primary italic text-xl">06.</span> Foro de Eleição
                </h2>
                <p>
                  Para dirimir quaisquer controvérsias oriundas deste instrumento, as partes elegem o foro da Comarca da sede da detentora da plataforma, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center">
            <div className="flex items-center justify-center space-x-2 opacity-30 group cursor-default mb-4">
              <Dumbbell className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-headline text-base font-bold tracking-tighter">
                FitBase Security & Legal
              </span>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground">
              Proteção Jurídica Ativa • <span className="animate-text-flash italic inline-block">WS Studios Company</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
