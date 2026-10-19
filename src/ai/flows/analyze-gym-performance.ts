
'use server';
/**
 * @fileOverview Fluxo Genkit para análise estratégica de negócios fitness.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeGymPerformanceInputSchema = z.object({
  totalMembers: z.number().describe('Total de alunos matriculados.'),
  activeMembers: z.number().describe('Total de alunos com plano ativo.'),
  pendingPaymentsCount: z.number().describe('Quantidade de pagamentos em atraso ou pendentes.'),
  totalRevenue: z.number().describe('Faturamento total do período selecionado.'),
});
export type AnalyzeGymPerformanceInput = z.infer<typeof AnalyzeGymPerformanceInputSchema>;

const AnalyzeGymPerformanceOutputSchema = z.object({
  churnRate: z.string().describe('Taxa de cancelamento estimada.'),
  financialHealth: z.string().describe('Avaliação da saúde financeira da academia.'),
  growthSuggestions: z.string().describe('Sugestões acionáveis para aumentar o lucro em tópicos.'),
  alertLevel: z.enum(['baixo', 'medio', 'alto']).describe('Nível de urgência para ações de gestão.'),
});
export type AnalyzeGymPerformanceOutput = z.infer<typeof AnalyzeGymPerformanceOutputSchema>;

export async function analyzeGymPerformance(input: AnalyzeGymPerformanceInput): Promise<AnalyzeGymPerformanceOutput> {
  return analyzeGymPerformanceFlow(input);
}

const analyzeGymPerformancePrompt = ai.definePrompt({
  name: 'analyzeGymPerformancePrompt',
  input: { schema: AnalyzeGymPerformanceInputSchema },
  output: { schema: AnalyzeGymPerformanceOutputSchema },
  prompt: `Você é o FitFlow IA, um consultor sênior de gestão para academias.
Analise os dados fornecidos e gere insights estratégicos para o dono da academia.

DADOS DA ACADEMIA:
- Total de Alunos: {{{totalMembers}}}
- Alunos Ativos: {{{activeMembers}}}
- Pagamentos Pendentes: {{{pendingPaymentsCount}}}
- Faturamento Total: R$ {{{totalRevenue}}}

DIRETRIZES:
- Seja direto e focado em lucro e retenção.
- Use emojis relacionados a fitness e finanças (💪, 📈, 💰).
- Identifique riscos de inadimplência.
- Dê sugestões práticas (ex: campanhas de renovação, automação de cobrança).
- Não use tags HTML no retorno.`,
});

const analyzeGymPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeGymPerformanceFlow',
    inputSchema: AnalyzeGymPerformanceInputSchema,
    outputSchema: AnalyzeGymPerformanceOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeGymPerformancePrompt(input);
    if (!output) throw new Error('Falha na análise estratégica do FitFlow IA.');
    return output;
  }
);
