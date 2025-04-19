// src/ai/flows/document-summarization.ts
'use server';
/**
 * @fileOverview Summarizes legal documents, extracting key arguments and findings.
 *
 * - summarizeDocument - A function that handles the document summarization process.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document to summarize.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the legal document, highlighting key arguments and findings.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {
    schema: z.object({
      documentText: z.string().describe('The text content of the legal document to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the legal document, highlighting key arguments and findings.'),
    }),
  },
  prompt: `You are an expert legal professional, skilled at summarizing complex legal documents.

  Please provide a concise summary of the following legal document, highlighting the key arguments, findings, and conclusions.

  Document Text: {{{documentText}}}`,
});

const summarizeDocumentFlow = ai.defineFlow<
  typeof SummarizeDocumentInputSchema,
  typeof SummarizeDocumentOutputSchema
>({
  name: 'summarizeDocumentFlow',
  inputSchema: SummarizeDocumentInputSchema,
  outputSchema: SummarizeDocumentOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
