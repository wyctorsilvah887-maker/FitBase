
'use server';
/**
 * @fileOverview Fluxo Genkit para geração de guias de instalação e higienização de AC.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateACGuideInputSchema = z.object({
  brand: z.string().describe('Marca do aparelho.'),
  btus: z.string().describe('Capacidade em BTUs.'),
  guideType: z.enum(['instalação', 'higienização', 'manutenção_preventiva']).describe('Tipo de guia solicitado.'),
});
export type GenerateACGuideInput = z.infer<typeof GenerateACGuideInputSchema>;

const GenerateACGuideOutputSchema = z.object({
  title: z.string().describe('Título do guia.'),
  steps: z.string().describe('Passo a passo em tópicos.'),
  toolsNeeded: z.string().describe('Ferramentas e insumos necessários.'),
  performanceTips: z.string().describe('Dicas para otimizar o consumo de energia.'),
});
export type GenerateACGuideOutput = z.infer<typeof GenerateACGuideOutputSchema>;

export async function generateACGuide(input: GenerateACGuideInput): Promise<GenerateACGuideOutput> {
  return generateACGuideFlow(input);
}

const generateACGuidePrompt = ai.definePrompt({
  name: 'generateACGuidePrompt',
  input: { schema: GenerateACGuideInputSchema },
  output: { schema: GenerateACGuideOutputSchema },
  prompt: `Você é o Clima IA da WS Studios Company, especialista em normas técnicas (ABNT) e boas práticas de climatização.
Gere um guia profissional para: {{{guideType}}}.

DETALHES DO EQUIPAMENTO:
- Marca: {{{brand}}}
- Capacidade: {{{btus}}}

REGRAS:
- Use tópicos curtos começando com "• ".
- Foco em eficiência energética e vida útil do compressor.
- Se for higienização, foque na limpeza de evaporadora, filtros e dreno.
- Se for instalação, foque em infraestrutura e vácuo.

IMPORTANTE: Finalize lembrando que a instalação incorreta perde a garantia de fábrica.`,
});

const generateACGuideFlow = ai.defineFlow(
  {
    name: 'generateACGuideFlow',
    inputSchema: GenerateACGuideInputSchema,
    outputSchema: GenerateACGuideOutputSchema,
  },
  async (input) => {
    const { output } = await generateACGuidePrompt(input);
    if (!output) throw new Error('Falha ao gerar guia Clima IA.');
    return output;
  }
);
