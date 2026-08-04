'use server';
/**
 * @fileOverview Fluxo Genkit para geração de guias técnicos de ar condicionado.
 * 
 * - generateACGuide - Função principal para gerar guias de climatização.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateACGuideInputSchema = z.object({
  brand: z.string().describe('Marca do aparelho de ar condicionado.'),
  btus: z.string().describe('Capacidade em BTUs do equipamento.'),
  guideType: z.enum(['instalação', 'higienização', 'manutenção_preventiva']).describe('Tipo de procedimento técnico solicitado.'),
});
export type GenerateACGuideInput = z.infer<typeof GenerateACGuideInputSchema>;

const GenerateACGuideOutputSchema = z.object({
  title: z.string().describe('Título técnico do protocolo.'),
  steps: z.string().describe('Passo a passo detalhado em tópicos curtos.'),
  toolsNeeded: z.string().describe('Ferramentas, EPIs e insumos necessários.'),
  performanceTips: z.string().describe('Dicas de eficiência energética e conservação.'),
});
export type GenerateACGuideOutput = z.infer<typeof GenerateACGuideOutputSchema>;

export async function generateACGuide(input: GenerateACGuideInput): Promise<GenerateACGuideOutput> {
  return generateACGuideFlow(input);
}

const generateACGuidePrompt = ai.definePrompt({
  name: 'generateACGuidePrompt',
  input: { schema: GenerateACGuideInputSchema },
  output: { schema: GenerateACGuideOutputSchema },
  prompt: `Você é o Especialista Clima IA da WS Studios Company, uma autoridade em refrigeração e normas ABNT/PMOC.
Sua tarefa é gerar um protocolo técnico rigoroso e seguro para o procedimento de: {{{guideType}}}.

DADOS DO EQUIPAMENTO:
- Marca: {{{brand}}}
- Capacidade: {{{btus}}}

REGRAS DE RESPOSTA:
- Use terminologia técnica correta (fluido refrigerante, superaquecimento, vácuo, etc.).
- Use tópicos começando com "• ".
- Destaque sempre a segurança elétrica.
- Responda em Português do Brasil de forma clara para técnicos.

IMPORTANTE: Se o guia for de instalação, mencione obrigatoriamente a necessidade de bomba de vácuo e teste de estanqueidade.`,
});

const generateACGuideFlow = ai.defineFlow(
  {
    name: 'generateACGuideFlow',
    inputSchema: GenerateACGuideInputSchema,
    outputSchema: GenerateACGuideOutputSchema,
  },
  async (input) => {
    const { output } = await generateACGuidePrompt(input);
    if (!output) throw new Error('O Clima IA não conseguiu processar o protocolo no momento.');
    return output;
  }
);
