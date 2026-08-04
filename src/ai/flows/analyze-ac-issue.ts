
'use server';
/**
 * @fileOverview Fluxo Genkit para diagnóstico inteligente de problemas de climatização.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeACIssueInputSchema = z.object({
  description: z.string().describe('Descrição do problema (ruído, falta de gelo, vazamento, etc.).'),
  photoDataUri: z.string().optional().describe('Data URI opcional de uma foto da unidade ou erro.'),
});
export type AnalyzeACIssueInput = z.infer<typeof AnalyzeACIssueInputSchema>;

const AnalyzeACIssueOutputSchema = z.object({
  diagnosis: z.string().describe('Diagnóstico provável do problema.'),
  urgentAction: z.string().describe('Ação imediata recomendada (ex: desligar disjuntor).'),
  technicalSteps: z.string().describe('Passos técnicos recomendados para manutenção.'),
  safetyWarning: z.string().describe('Aviso de segurança vital.'),
});
export type AnalyzeACIssueOutput = z.infer<typeof AnalyzeACIssueOutputSchema>;

export async function analyzeACIssue(input: AnalyzeACIssueInput): Promise<AnalyzeACIssueOutput> {
  return analyzeACIssueFlow(input);
}

const analyzeACIssuePrompt = ai.definePrompt({
  name: 'analyzeACIssuePrompt',
  input: { schema: AnalyzeACIssueInputSchema },
  output: { schema: AnalyzeACIssueOutputSchema },
  prompt: `Você é o Clima IA, o assistente técnico especialista da WS Studios Company.
Sua missão é diagnosticar falhas em sistemas de ar condicionado (Split, Cassete, VRF, Janela).

DIRETRIZES:
- Seja extremamente técnico porém didático.
- Use emojis relacionados ao clima (❄️, 💧, ⚡, 🔧).
- Se houver risco elétrico ou de gás, destaque imediatamente.
- Responda em Português do Brasil.

DESCRIÇÃO DO PROBLEMA:
{{{description}}}

{{#if photoDataUri}}
IMAGEM PARA ANÁLISE: {{media url=photoDataUri}}
{{/if}}

INFORMAÇÃO VITAL: Sempre recomende que manutenções em partes elétricas ou de refrigeração devem ser feitas por técnicos credenciados.`,
});

const analyzeACIssueFlow = ai.defineFlow(
  {
    name: 'analyzeACIssueFlow',
    inputSchema: AnalyzeACIssueInputSchema,
    outputSchema: AnalyzeACIssueOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeACIssuePrompt(input);
    if (!output) throw new Error('Falha no diagnóstico da Clima IA.');
    return output;
  }
);
