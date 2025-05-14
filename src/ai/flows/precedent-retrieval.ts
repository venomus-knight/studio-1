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
    // Default Knowledge Base Simulation:
    // Currently, when 'useCustomLibrary' is false, this flow simulates accessing a
    // comprehensive default RAG (Retrieval Augmented Generation) knowledge base of
    // past Indian court cases. This simulation is achieved by leveraging the LLM's
    // broad training data, guided by the prompt above. There isn't a separate
    // document upload mechanism for this default base within the current application structure.
    //
    // Custom Library (Future RAG Implementation):
    // When 'useCustomLibrary' is true, it's intended to (eventually) query a user-specific
    // vector store. This vector store would be populated by documents uploaded by the user
    // via the "My Custom Case Library" UI feature.
    //
    // For now, 'useCustomLibrary' primarily acts as a prompt differentiator.
    // A full RAG implementation would involve setting up a vector database and ingestion
    // pipelines for both default and custom documents, allowing the AI to retrieve
    // specific text chunks to "augment" its generation process.
    const {output} = await prompt(input);
    return output!;
  }
);
