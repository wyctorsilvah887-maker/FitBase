'use server';
/**
 * @fileOverview Fluxo Genkit para geração de guias técnicos de ar condicionado.
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
  prompt: `Você é o Especialista Clima IA da WS Studios Company.
Gere um protocolo técnico rigoroso para: {{{guideType}}}.

EQUIPAMENTO:
- Marca: {{{brand}}}
- Capacidade: {{{btus}}}

REGRAS:
- Use emojis relacionados a ferramentas (🔧, ⚡, ❄️).
- Seja extremamente técnico e preciso.
- Destaque sempre a segurança elétrica e o uso de EPIs.
- Não use tags HTML no retorno.`,
});

const generateACGuideFlow = ai.defineFlow(
  {
    name: 'generateACGuideFlow',
    inputSchema: GenerateACGuideInputSchema,
    outputSchema: GenerateACGuideOutputSchema,
  },
  async (input) => {
    const { output } = await generateACGuidePrompt(input);
    if (!output) throw new Error('Falha técnica na geração do protocolo.');
    return output;
  }
);
