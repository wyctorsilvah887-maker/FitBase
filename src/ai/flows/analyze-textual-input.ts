'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing textual input related to pet food ingredients or animal symptoms.
 *
 * - analyzeTextualInput - A function that handles the textual analysis process.
 * - AnalyzeTextualInput - The input type for the analyzeTextualInput function.
 * - AnalyzeTextualOutput - The return type for the analyzeTextualInput function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for the textual analysis flow
const AnalyzeTextualInputSchema = z.object({
  description: z.string().describe('Descrição textual dos ingredientes da ração ou dos sintomas do animal. A resposta deve ser em Português do Brasil.'),
});
export type AnalyzeTextualInput = z.infer<typeof AnalyzeTextualInputSchema>;

// Output schema for the textual analysis flow
const AnalyzeTextualOutputSchema = z.object({
  analysisSummary: z.string().describe('Um resumo claro e conciso da análise do texto fornecido, em Português do Brasil.'),
  insights: z.string().describe('Insights e informações detalhadas sobre os ingredientes ou sintomas, incluindo potenciais implicações para a saúde do animal, em Português do Brasil.'),
  recommendations: z.string().describe('Recomendações acionáveis e próximos passos, adaptadas para a situação descrita e em Português do Brasil.'),
});
export type AnalyzeTextualOutput = z.infer<typeof AnalyzeTextualOutputSchema>;

// Wrapper function to call the Genkit flow
export async function analyzeTextualInput(input: AnalyzeTextualInput): Promise<AnalyzeTextualOutput> {
  return analyzeTextualInputFlow(input);
}

// Define the prompt for the textual analysis
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

Com base na descrição abaixo, forneça a análise preenchendo os campos de saída (resumo, insights e recomendações) seguindo rigorosamente as diretrizes acima.

Descrição fornecida pelo usuário:
{{{description}}}`,
});

// Define the Genkit flow for textual analysis
const analyzeTextualInputFlow = ai.defineFlow(
  {
    name: 'analyzeTextualInputFlow',
    inputSchema: AnalyzeTextualInputSchema,
    outputSchema: AnalyzeTextualOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeTextualInputPrompt(input);
    if (!output) {
      throw new Error('No output received from the AI model.');
    }
    return output;
  }
);
