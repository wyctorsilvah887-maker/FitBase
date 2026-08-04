'use server';
/**
 * @fileOverview Fluxo Genkit para diagnóstico inteligente de falhas em climatização.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeACIssueInputSchema = z.object({
  description: z.string().describe('Descrição dos sintomas (ruídos, códigos de erro, vazamentos).'),
  photoDataUri: z.string().optional().describe('Data URI de foto da unidade ou placa eletrônica.'),
});
export type AnalyzeACIssueInput = z.infer<typeof AnalyzeACIssueInputSchema>;

const AnalyzeACIssueOutputSchema = z.object({
  diagnosis: z.string().describe('Diagnóstico técnico provável.'),
  urgentAction: z.string().describe('Ação de emergência imediata (ex: isolar energia).'),
  technicalSteps: z.string().describe('Procedimentos recomendados para o reparo.'),
  safetyWarning: z.string().describe('Aviso de segurança crítico.'),
});
export type AnalyzeACIssueOutput = z.infer<typeof AnalyzeACIssueOutputSchema>;

export async function analyzeACIssue(input: AnalyzeACIssueInput): Promise<AnalyzeACIssueOutput> {
  return analyzeACIssueFlow(input);
}

const analyzeACIssuePrompt = ai.definePrompt({
  name: 'analyzeACIssuePrompt',
  input: { schema: AnalyzeACIssueInputSchema },
  output: { schema: AnalyzeACIssueOutputSchema },
  prompt: `Você é o Clima IA, assistente de engenharia da WS Studios Company. 
Analise a falha relatada e forneça um diagnóstico técnico preciso.

PROBLEMA RELATADO:
{{{description}}}

{{#if photoDataUri}}
IMAGEM DO EQUIPAMENTO: {{media url=photoDataUri}}
{{/if}}

DIRETRIZES:
- Identifique possíveis componentes defeituosos (capacitor, compressor, sensor de degelo, etc.).
- Use emojis relacionados ao clima (❄️, ⚡, 🔧).
- Seja direto e profissional.
- Lembre que intervenções devem ser feitas por técnicos qualificados.`,
});

const analyzeACIssueFlow = ai.defineFlow(
  {
    name: 'analyzeACIssueFlow',
    inputSchema: AnalyzeACIssueInputSchema,
    outputSchema: AnalyzeACIssueOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeACIssuePrompt(input);
    if (!output) throw new Error('Falha na análise técnica do Clima IA.');
    return output;
  }
);
