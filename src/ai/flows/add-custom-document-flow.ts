// src/ai/flows/add-custom-document-flow.ts
'use server';
/**
 * @fileOverview Flow for adding a document to the user's custom knowledge library.
 *
 * - addDocumentToCustomLibrary - A function that ingests document text into the custom library.
 * - AddDocumentInput - The input type for the function.
 * - AddDocumentOutput - The return type for the function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {addCustomDocument as addDocumentService} from '@/ai/services/custom-document-store';

const AddDocumentInputSchema = z.object({
  documentText: z.string().describe('The text content of the document to add to the custom library.'),
});
export type AddDocumentInput = z.infer<typeof AddDocumentInputSchema>;

const AddDocumentOutputSchema = z.object({
  message: z.string().describe('A confirmation message indicating the result of the operation.'),
  librarySize: z.number().describe('The new total number of documents in the custom library.'),
});
export type AddDocumentOutput = z.infer<typeof AddDocumentOutputSchema>;

export async function addDocumentToCustomLibrary(input: AddDocumentInput): Promise<AddDocumentOutput> {
  return addDocumentToCustomLibraryFlow(input);
}

const addDocumentToCustomLibraryFlow = ai.defineFlow(
  {
    name: 'addDocumentToCustomLibraryFlow',
    inputSchema: AddDocumentInputSchema,
    outputSchema: AddDocumentOutputSchema,
  },
  async (input) => {
    if (!input.documentText.trim()) {
      throw new Error('Document text cannot be empty.');
    }
    await addDocumentService(input.documentText);
    // In a real scenario, you might import getAllCustomDocuments here or have the service return the size.
    // For simplicity, we'll just acknowledge addition. A more robust count would come from the service.
    // This is a conceptual representation.
    const {getAllCustomDocuments} = await import('@/ai/services/custom-document-store');
    const docs = await getAllCustomDocuments();

    return {
      message: 'Document successfully added to your custom library.',
      librarySize: docs.length,
    };
  }
);
