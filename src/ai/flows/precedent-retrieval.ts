'use server';

/**
 * @fileOverview Retrieves relevant past Indian court cases based on a legal question or case details by querying a knowledge base.
 *
 * - retrievePrecedent - A function that retrieves relevant past Indian court cases.
 * - RetrievePrecedentInput - The input type for the retrievePrecedent function.
 * - RetrievePrecedentOutput - The return type for the retrievePrecedent function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RetrievePrecedentInputSchema = z.object({
  legalQuestion: z.string().describe('The legal question or case details to retrieve precedents for.'),
  useCustomLibrary: z.boolean().optional().describe('Whether to query a user-specific custom case library.'),
});
export type RetrievePrecedentInput = z.infer<typeof RetrievePrecedentInputSchema>;

const RetrievePrecedentOutputSchema = z.object({
  precedents: z.array(
    z.object({
      caseName: z.string().describe('The name of the case.'),
      citation: z.string().describe('The citation of the case.'),
      summary: z.string().describe('A brief summary of the case and its relevance.'),
      differences: z.string().optional().describe('Key differences compared to the input query, if applicable.')
    })
  ).describe('A list of relevant past Indian court cases.'),
});
export type RetrievePrecedentOutput = z.infer<typeof RetrievePrecedentOutputSchema>;

export async function retrievePrecedent(input: RetrievePrecedentInput): Promise<RetrievePrecedentOutput> {
  return retrievePrecedentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'retrievePrecedentPrompt',
  input: {
    schema: z.object({
      legalQuestion: z.string().describe('The legal question or case details to retrieve precedents for.'),
      useCustomLibrary: z.boolean().optional().describe('Whether to query a user-specific custom case library.'),
    }),
  },
  output: {
    schema: z.object({
      precedents: z.array(
        z.object({
          caseName: z.string().describe('The name of the case.'),
          citation: z.string().describe('The citation of the case.'),
          summary: z.string().describe('A brief summary of the case and its relevance.'),
          differences: z.string().optional().describe('Key differences compared to the input query, if applicable and notable.')
        })
      ).describe('A list of relevant past Indian court cases.'),
    }),
  },
  prompt: `You are an expert in Indian law and possess extensive knowledge of past Indian court cases, accessed through a comprehensive knowledge base.
  {{#if useCustomLibrary}}
  You will prioritize searching within the user's custom uploaded case library.
  {{else}}
  You will search the general knowledge base of Indian case law.
  {{/if}}

  Based on the legal question or case details provided, retrieve relevant past Indian court cases that may serve as precedents or provide insights.
  For each precedent, provide the case name, citation, a brief summary of the case and its relevance.
  Crucially, if there are notable differences between the retrieved precedent and the user's query, highlight these differences.

  Legal Question or Case Details: {{{legalQuestion}}}

  Format your response as a JSON array of precedents, where each precedent includes the caseName, citation, summary, and optionally, differences.
  `,
});

const retrievePrecedentFlow = ai.defineFlow<
  typeof RetrievePrecedentInputSchema,
  typeof RetrievePrecedentOutputSchema
>(
  {
    name: 'retrievePrecedentFlow',
    inputSchema: RetrievePrecedentInputSchema,
    outputSchema: RetrievePrecedentOutputSchema,
  },
  async input => {
    // In a real RAG system, 'useCustomLibrary' would determine which vector store to query.
    // For now, it's mainly a prompt differentiator.
    const {output} = await prompt(input);
    return output!;
  }
);
