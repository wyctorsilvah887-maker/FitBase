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
});
export type GenerateCareGuideInput = z.infer<typeof GenerateCareGuideInputSchema>;

const GenerateCareGuideOutputSchema = z.object({
  guideTitle: z.string().describe('Título personalizado para o guia.'),
  essentialCare: z.string().describe('Cuidados essenciais em tópicos curtos.'),
  nutritionTips: z.string().describe('Dicas de nutrição específicas.'),
  healthAlerts: z.string().describe('Alertas de saúde para a raça/idade.'),
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
Sua tarefa é gerar um guia de cuidados ultra-personalizado para um pet.

DADOS DO PET:
- Nome: {{{name}}}
- Espécie: {{{species}}}
- Raça: {{{breed}}}
- Idade: {{{age}}}

DIRETRIZES:
- Use emojis 🐾.
- Seja conciso e direto.
- Use tópicos curtos começando com "- ".
- NÃO USE tags HTML.
- Fale diretamente com o tutor de forma amigável.

ESTRUTURA DO GUIA:
1. Título: Algo carinhoso como "Guia de Bem-estar para {{{name}}}".
2. Cuidados Essenciais: Foco na rotina, higiene e ambiente.
3. Dicas de Nutrição: Alinhadas com a espécie e idade.
4. Alertas de Saúde: Problemas comuns na raça ou fase da vida.

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
