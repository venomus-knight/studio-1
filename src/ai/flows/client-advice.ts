'use server';
/**
 * @fileOverview Provides preliminary legal guidance to clients based on their queries and relevant Indian laws.
 *
 * - getClientAdvice - A function that takes a legal question as input and returns preliminary legal advice.
 * - ClientAdviceInput - The input type for the getClientAdvice function.
 * - ClientAdviceOutput - The return type for the getClientAdvice function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ClientAdviceInputSchema = z.object({
  legalQuestion: z.string().describe('The legal question asked by the client.'),
});
export type ClientAdviceInput = z.infer<typeof ClientAdviceInputSchema>;

const ClientAdviceOutputSchema = z.object({
  advice: z.string().describe('Preliminary legal guidance based on the question and relevant Indian laws.'),
  relevantLaws: z.array(z.string()).describe('List of relevant Indian laws related to the advice.'),
  disclaimer: z.string().describe('A disclaimer that this is not a substitute for professional legal advice.'),
});
export type ClientAdviceOutput = z.infer<typeof ClientAdviceOutputSchema>;

export async function getClientAdvice(input: ClientAdviceInput): Promise<ClientAdviceOutput> {
  return clientAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'clientAdvicePrompt',
  input: {
    schema: z.object({
      legalQuestion: z.string().describe('The legal question asked by the client.'),
    }),
  },
  output: {
    schema: z.object({
      advice: z.string().describe('Preliminary legal guidance based on the question and relevant Indian laws.'),
      relevantLaws: z.array(z.string()).describe('List of relevant Indian laws related to the advice.'),
      disclaimer: z.string().describe('A disclaimer that this is not a substitute for professional legal advice.'),
    }),
  },
  prompt: `You are an AI legal assistant providing preliminary legal guidance to clients based on Indian law.\n\nAnswer the following legal question to the best of your ability, citing relevant Indian laws where applicable. Include a disclaimer that this is not a substitute for professional legal advice. List the relevant laws used to formulate the answer.  Be very clear that this advice is not a substitute for actual, professional, legal advice.\n\nQuestion: {{{legalQuestion}}}`,
});

const clientAdviceFlow = ai.defineFlow<
  typeof ClientAdviceInputSchema,
  typeof ClientAdviceOutputSchema
>(
  {
    name: 'clientAdviceFlow',
    inputSchema: ClientAdviceInputSchema,
    outputSchema: ClientAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      disclaimer: 'This is preliminary legal guidance and not a substitute for advice from a professional legal expert.',
    };
  }
);
