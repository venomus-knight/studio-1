'use server';
/**
 * @fileOverview Generates a jurisdiction-specific procedural checklist for a legal matter.
 *
 * - generateChecklist - A function that takes a query and jurisdiction, and returns a procedural checklist.
 * - GenerateChecklistInput - The input type for the generateChecklist function.
 * - GenerateChecklistOutput - The return type for the generateChecklist function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateChecklistInputSchema = z.object({
  query: z.string().describe('The user\'s legal query or description of the legal matter.'),
  jurisdiction: z.string().describe('The relevant jurisdiction (e.g., "India", "State of Maharashtra").'),
});
export type GenerateChecklistInput = z.infer<typeof GenerateChecklistInputSchema>;

const GenerateChecklistOutputSchema = z.object({
  checklist: z.array(z.string()).describe('A list of procedural steps or considerations.'),
});
export type GenerateChecklistOutput = z.infer<typeof GenerateChecklistOutputSchema>;

export async function generateChecklist(input: GenerateChecklistInput): Promise<GenerateChecklistOutput> {
  return generateChecklistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChecklistPrompt',
  input: {schema: GenerateChecklistInputSchema},
  output: {schema: GenerateChecklistOutputSchema},
  prompt: `You are an AI legal assistant.
Generate a high-level procedural checklist for the following legal matter within the specified jurisdiction: {{{jurisdiction}}}.
The checklist should outline key steps or considerations.

Legal Matter: {{{query}}}

Provide the checklist as a list of strings.`,
});

const generateChecklistFlow = ai.defineFlow(
  {
    name: 'generateChecklistFlow',
    inputSchema: GenerateChecklistInputSchema,
    outputSchema: GenerateChecklistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || { checklist: [] };
  }
);
