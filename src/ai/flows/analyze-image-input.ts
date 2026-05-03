'use server';
/**
 * @fileOverview A Genkit flow for analyzing images of pet food labels or pet symptoms.
 *
 * - analyzeImageInput - A function that handles the image analysis process.
 * - AnalyzeImageInput - The input type for the analyzeImageInput function.
 * - AnalyzeImageOutput - The return type for the analyzeImageInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a pet food label or a pet symptom, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'A detailed analysis of the image, identifying if it\'s a pet food label or a symptom, extracting relevant information, and providing preliminary guidance in Brazilian Portuguese.'
    ),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImageInput(
  input: AnalyzeImageInput
): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const analyzeImagePrompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `Você é um assistente veterinário especializado em analisar imagens de alimentos para animais de estimação e sintomas de saúde animal.
Sua tarefa é analisar a imagem fornecida, identificar se é um rótulo de ração, um alimento ou um sintoma visível em um animal.
Em seguida, extraia as informações mais relevantes e forneça uma análise preliminar e orientações claras, tudo em português do Brasil.

Se for um rótulo de ração ou alimento:
- Identifique o tipo de alimento (ração, petisco, etc.).
- Mencione os ingredientes principais ou informações nutricionais visíveis.
- Dê uma avaliação geral se parece ser adequado para o animal, ou se há algo a observar.

Se for um sintoma:
- Descreva o que você observa na imagem (ex: tipo de lesão, alteração na pele, etc.).
- Forneça uma possível interpretação ou o que pode ser.
- Ofereça orientações sobre os próximos passos, como "consultar um veterinário imediatamente", "observar por X horas", ou "medidas de primeiros socorros simples".

Sempre responda de forma profissional, compreensível e útil para um proprietário de animal de estimação.

Imagem para análise: {{media url=photoDataUri}}`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeImagePrompt(input);
    if (!output) {
      throw new Error('Failed to get analysis from the AI.');
    }
    return output;
  }
);
