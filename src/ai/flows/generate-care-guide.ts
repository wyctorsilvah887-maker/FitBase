'use server';
/**
 * @fileOverview Define o fluxo Genkit para geração de guia de cuidados personalizados.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCareGuideInputSchema = z.object({
  name: z.string().describe('Nome do animal.'),
  species: z.string().describe('Espécie do animal (ex: cão, gato).'),
  breed: z.string().describe('Raça do animal.'),
  age: z.string().describe('Idade aproximada do animal.'),
  guideType: z.enum(['cuidados', 'saude', 'adestramento', 'nutricao']).describe('O foco principal do guia solicitado.'),
});
export type GenerateCareGuideInput = z.infer<typeof GenerateCareGuideInputSchema>;

const GenerateCareGuideOutputSchema = z.object({
  guideTitle: z.string().describe('Título personalizado para o guia.'),
  essentialCare: z.string().describe('Conteúdo principal em tópicos curtos.'),
  nutritionTips: z.string().describe('Dicas secundárias ou relacionadas.'),
  healthAlerts: z.string().describe('Alertas específicos para o tipo de guia e pet.'),
});
export type GenerateCareGuideOutput = z.infer<typeof GenerateCareGuideOutputSchema>;

export async function generateCareGuide(input: GenerateCareGuideInput): Promise<GenerateCareGuideOutput> {
  return generateCareGuideFlow(input);
}

const generateCareGuidePrompt = ai.definePrompt({
  name: 'generateCareGuidePrompt',
  input: { schema: GenerateCareGuideInputSchema },
  output: { schema: GenerateCareGuideOutputSchema },
  prompt: `Você é a Vet IA, especialista em bem-estar animal da WS Studios.
Sua tarefa é gerar um guia de cuidados ultra-personalizado focado em: {{{guideType}}}.

DADOS DO PET:
- Nome: {{{name}}}
- Espécie: {{{species}}}
- Raça: {{{breed}}}
- Idade: {{{age}}}
- Foco do Guia: {{{guideType}}}

DIRETRIZES:
- Use emojis 🐾.
- Seja conciso e direto.
- Use tópicos curtos começando com "- ".
- NÃO USE tags HTML.
- Fale diretamente com o tutor de forma amigável.

ESTRUTURA DO GUIA (Ajuste conforme o Foco):
1. Título: Algo carinhoso relacionado ao foco {{{guideType}}}.
2. Conteúdo Principal: Se for adestramento, foque em comportamento; se for saúde, em prevenção; se for nutrição, em dieta.
3. Dicas Extras: Informações complementares úteis.
4. Alertas: Riscos comuns para a raça/idade/foco.

IMPORTANTE: Finalize sempre lembrando que este guia é informativo e a visita ao veterinário é indispensável.`,
});

const generateCareGuideFlow = ai.defineFlow(
  {
    name: 'generateCareGuideFlow',
    inputSchema: GenerateCareGuideInputSchema,
    outputSchema: GenerateCareGuideOutputSchema,
  },
  async (input) => {
    const { output } = await generateCareGuidePrompt(input);
    if (!output) throw new Error('Falha na geração do guia de cuidados.');
    return output;
  }
);
