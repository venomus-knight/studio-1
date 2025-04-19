'use server';

/**
 * @fileOverview Retrieves relevant past Indian court cases based on a legal question or case details.
 *
 * - retrievePrecedent - A function that retrieves relevant past Indian court cases.
 * - RetrievePrecedentInput - The input type for the retrievePrecedent function.
 * - RetrievePrecedentOutput - The return type for the retrievePrecedent function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RetrievePrecedentInputSchema = z.object({
  legalQuestion: z.string().describe('The legal question or case details to retrieve precedents for.'),
});
export type RetrievePrecedentInput = z.infer<typeof RetrievePrecedentInputSchema>;

const RetrievePrecedentOutputSchema = z.object({
  precedents: z.array(
    z.object({
      caseName: z.string().describe('The name of the case.'),
      citation: z.string().describe('The citation of the case.'),
      summary: z.string().describe('A brief summary of the case and its relevance.'),
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
    }),
  },
  output: {
    schema: z.object({
      precedents: z.array(
        z.object({
          caseName: z.string().describe('The name of the case.'),
          citation: z.string().describe('The citation of the case.'),
          summary: z.string().describe('A brief summary of the case and its relevance.'),
        })
      ).describe('A list of relevant past Indian court cases.'),
    }),
  },
  prompt: `You are an expert in Indian law and possess extensive knowledge of past Indian court cases.

  Based on the legal question or case details provided, retrieve relevant past Indian court cases that may serve as precedents or provide insights. Provide the case name, citation, and a brief summary of the case and its relevance.

  Legal Question or Case Details: {{{legalQuestion}}}

  Format your response as a JSON array of precedents, where each precedent includes the caseName, citation, and summary.
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
    const {output} = await prompt(input);
    return output!;
  }
);
