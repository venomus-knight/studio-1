// src/ai/flows/precedent-retrieval.ts
'use server';

/**
 * @fileOverview Retrieves relevant past Indian court cases based on a legal question or case details.
 * Can query a general knowledge base or a user-specific custom case library.
 *
 * - retrievePrecedent - A function that retrieves relevant past Indian court cases.
 * - RetrievePrecedentInput - The input type for the retrievePrecedent function.
 * - RetrievePrecedentOutput - The return type for the retrievePrecedent function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getAllCustomDocuments} from '@/ai/services/custom-document-store';

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
  sourceType: z.string().describe('Indicates if the precedents were sourced from the "General Knowledge Base" or "Custom User Library".')
});
export type RetrievePrecedentOutput = z.infer<typeof RetrievePrecedentOutputSchema>;

export async function retrievePrecedent(input: RetrievePrecedentInput): Promise<RetrievePrecedentOutput> {
  return retrievePrecedentFlow(input);
}

const PromptInputSchema = z.object({
  legalQuestion: z.string().describe('The legal question or case details to retrieve precedents for.'),
  useCustomLibrary: z.boolean().optional().describe('Whether to query a user-specific custom case library.'),
  customDocuments: z.array(z.string()).optional().describe('A list of custom documents provided by the user to reference.'),
});

const prompt = ai.definePrompt({
  name: 'retrievePrecedentPrompt',
  input: {
    schema: PromptInputSchema,
  },
  output: {
    // The output schema for the prompt itself will just be the precedents array part.
    // The sourceType will be added by the flow.
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
  prompt: `You are an expert in Indian law and possess extensive knowledge of past Indian court cases.
  {{#if useCustomLibrary}}
    You will prioritize searching within the user's custom uploaded case library. The relevant sections from these documents are provided below.
    {{#if customDocuments.length}}
      User-Provided Documents to Reference:
      {{#each customDocuments}}
      --- Document Start ---
      {{{this}}}
      --- Document End ---
      {{/each}}
    {{else}}
      (No custom documents were provided or found in the user's library for this query, but the user indicated to use their custom library. Proceed by searching your general knowledge, but acknowledge if no specific custom information was found.)
    {{/if}}
  {{else}}
    You will search the general knowledge base of Indian case law.
  {{/if}}

  Based on the legal question or case details provided, retrieve relevant past Indian court cases that may serve as precedents or provide insights.
  For each precedent, provide the case name, citation, a brief summary of the case and its relevance.
  Crucially, if there are notable differences between the retrieved precedent and the user's query, highlight these differences.

  Legal Question or Case Details: {{{legalQuestion}}}

  Format your response as a JSON array of precedents, where each precedent includes the caseName, citation, summary, and optionally, differences.
  If no relevant precedents are found, return an empty array.
  `,
});

const retrievePrecedentFlow = ai.defineFlow(
  {
    name: 'retrievePrecedentFlow',
    inputSchema: RetrievePrecedentInputSchema,
    outputSchema: RetrievePrecedentOutputSchema,
  },
  async (input) => {
    let customDocumentsForPrompt: string[] = [];
    let sourceType = "General Knowledge Base";

    if (input.useCustomLibrary) {
      sourceType = "Custom User Library";
      // In a real RAG system, you'd embed the legalQuestion and perform a similarity search
      // against the vector embeddings of the custom documents.
      // For this simulation, we'll fetch all custom documents and let the LLM do the filtering.
      customDocumentsForPrompt = await getAllCustomDocuments();
      console.log(`Retrieved ${customDocumentsForPrompt.length} custom documents for the prompt.`);
    } else {
      // Default Knowledge Base Simulation:
      // When 'useCustomLibrary' is false, this flow simulates accessing a
      // comprehensive default RAG (Retrieval Augmented Generation) knowledge base of
      // past Indian court cases. This simulation is achieved by leveraging the LLM's
      // broad training data, guided by the prompt.
      console.log("Using general knowledge base for precedent retrieval.");
    }

    const promptInput: z.infer<typeof PromptInputSchema> = {
      legalQuestion: input.legalQuestion,
      useCustomLibrary: input.useCustomLibrary,
      customDocuments: customDocumentsForPrompt,
    };

    const {output} = await prompt(promptInput);
    
    return {
      precedents: output?.precedents || [], // Ensure precedents is always an array
      sourceType: sourceType,
    };
  }
);
