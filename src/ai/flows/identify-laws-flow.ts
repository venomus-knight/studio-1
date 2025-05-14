'use server';
/**
 * @fileOverview Identifies relevant Indian laws and articles based on a user's query.
 *
 * - identifyLaws - A function that takes a query and returns a list of applicable laws.
 * - IdentifyLawsInput - The input type for the identifyLaws function.
 * - IdentifyLawsOutput - The return type for the identifyLaws function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const IdentifyLawsInputSchema = z.object({
  query: z.string().describe('The user\'s legal query or description of their situation.'),
});
export type IdentifyLawsInput = z.infer<typeof IdentifyLawsInputSchema>;

const IdentifyLawsOutputSchema = z.object({
  laws: z.array(z.string()).describe('A list of potentially applicable Indian laws, sections, or articles.'),
});
export type IdentifyLawsOutput = z.infer<typeof IdentifyLawsOutputSchema>;

export async function identifyLaws(input: IdentifyLawsInput): Promise<IdentifyLawsOutput> {
  return identifyLawsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyLawsPrompt',
  input: {schema: IdentifyLawsInputSchema},
  output: {schema: IdentifyLawsOutputSchema},
  prompt: `You are an AI legal assistant specializing in Indian law.
Based on the following legal query, identify and list the key Indian laws, legal acts, sections, or articles that are most relevant.
Be concise and focus on the primary legal instruments applicable.

Query: {{{query}}}

Provide your answer as a list of strings.`,
});

const identifyLawsFlow = ai.defineFlow(
  {
    name: 'identifyLawsFlow',
    inputSchema: IdentifyLawsInputSchema,
    outputSchema: IdentifyLawsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || { laws: [] };
  }
);
