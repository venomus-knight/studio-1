// src/ai/flows/parse-structured-legal-info-flow.ts
'use server';
/**
 * @fileOverview Parses raw text (expected from Cloudflare AutoRAG) into structured legal information.
 *
 * - parseStructuredLegalInfo - A function that takes raw text and returns structured laws, precedents, and checklist.
 * - ParseStructuredLegalInfoInput - The input type for the function.
 * - ParseStructuredLegalInfoOutput - The return type for the function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ParseStructuredLegalInfoInputSchema = z.object({
  rawText: z.string().describe('The raw text output from an AI, expected to contain legal information.'),
});
export type ParseStructuredLegalInfoInput = z.infer<typeof ParseStructuredLegalInfoInputSchema>;

const ParseStructuredLegalInfoOutputSchema = z.object({
  laws: z.array(z.string()).describe('A list of potentially applicable laws, sections, or articles.'),
  precedents: z.array(
    z.object({
      caseName: z.string().describe('The name of the case.'),
      citation: z.string().describe('The citation of the case.'),
      summary: z.string().describe('A brief summary of the case and its relevance.'),
      differences: z.string().optional().describe('Key differences compared to the input query, if applicable and notable.'),
    })
  ).describe('A list of relevant past court cases.'),
  checklist: z.array(z.string()).describe('A list of procedural steps or considerations.'),
});
export type ParseStructuredLegalInfoOutput = z.infer<typeof ParseStructuredLegalInfoOutputSchema>;

export async function parseStructuredLegalInfo(input: ParseStructuredLegalInfoInput): Promise<ParseStructuredLegalInfoOutput> {
  return parseStructuredLegalInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseStructuredLegalInfoPrompt',
  input: {schema: ParseStructuredLegalInfoInputSchema},
  output: {schema: ParseStructuredLegalInfoOutputSchema},
  prompt: `You are an expert text processing AI. Your task is to parse the following raw text, which is an output from another AI assistant.
The text contains information about applicable laws, similar legal precedents, and a procedural checklist.
Extract this information and structure it strictly according to the JSON schema provided for your output.

Ensure the following:
- "laws" should be an array of strings, where each string is a distinct law, section, or article.
- "precedents" should be an array of objects. Each object must have "caseName" (string), "citation" (string), and "summary" (string). It can optionally have "differences" (string).
- "checklist" should be an array of strings, where each string is a distinct procedural step.

If any section is missing or cannot be reliably extracted from the text, return an empty array for that section. Do not invent information.

Raw text to parse:
{{{rawText}}}
`,
});

const parseStructuredLegalInfoFlow = ai.defineFlow(
  {
    name: 'parseStructuredLegalInfoFlow',
    inputSchema: ParseStructuredLegalInfoInputSchema,
    outputSchema: ParseStructuredLegalInfoOutputSchema,
  },
  async (input) => {
    if (!input.rawText.trim()) {
        // Return empty structure if rawText is empty
        return {
            laws: [],
            precedents: [],
            checklist: [],
        };
    }
    const {output} = await prompt(input);
    return output || { laws: [], precedents: [], checklist: [] }; // Ensure a valid structure is always returned
  }
);
