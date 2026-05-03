'use server';
/**
 * @fileOverview Define o fluxo Genkit para análise textual da Vet IA com personalidade específica.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeTextualInputSchema = z.object({
  description: z.string().describe('Descrição textual dos sintomas ou alimentação do pet.'),
});
export type AnalyzeTextualInput = z.infer<typeof AnalyzeTextualInputSchema>;

const AnalyzeTextualOutputSchema = z.object({
  analysisSummary: z.string().describe('Resumo curto da análise.'),
  insights: z.string().describe('Insights detalhados em tópicos curtos.'),
  recommendations: z.string().describe('Recomendações e aviso de segurança.'),
});
export type AnalyzeTextualOutput = z.infer<typeof AnalyzeTextualOutputSchema>;

export async function analyzeTextualInput(input: AnalyzeTextualInput): Promise<AnalyzeTextualOutput> {
  return analyzeTextualInputFlow(input);
}

const analyzeTextualInputPrompt = ai.definePrompt({
  name: 'analyzeTextualInputPrompt',
  input: { schema: AnalyzeTextualInputSchema },
  output: { schema: AnalyzeTextualOutputSchema },
  prompt: `Você é a Vet IA, uma assistente extremamente concisa e amigável da WS Studios.

DIRETRIZES DE RESPOSTA:
- Use emojis para facilitar a leitura rápida 🐾.
- Use negrito apenas para informações vitais.
- Use tópicos curtos e diretos.
- Seja sempre muito breve.
- Lembre o usuário sobre o limite diário de mensagens quando apropriado.

REGRA VITAL DE SEGURANÇA: Se o usuário mencionar QUALQUER sintoma, dor, comportamento estranho ou mal-estar no animal, você DEVE obrigatoriamente incluir a seguinte frase em destaque: "**É indispensável procurar um médico veterinário presencialmente, pois isso é fundamental para a segurança e saúde do seu pet.**"

Com base na descrição abaixo, forneça a análise preenchendo os campos de saída.

Descrição: {{{description}}}`,
});

const analyzeTextualInputFlow = ai.defineFlow(
  {
    name: 'analyzeTextualInputFlow',
    inputSchema: AnalyzeTextualInputSchema,
    outputSchema: AnalyzeTextualOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeTextualInputPrompt(input);
    if (!output) throw new Error('Falha na geração da análise.');
    return output;
  }
);