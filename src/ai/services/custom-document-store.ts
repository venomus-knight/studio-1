// src/ai/services/custom-document-store.ts
'use server';
/**
 * @fileOverview A simple in-memory store for custom user documents.
 * This is a placeholder for a proper vector database in a full RAG system.
 */

// In-memory array to store document texts
const customDocuments: string[] = [];

/**
 * Adds a document's text content to the custom library.
 * @param text The text content of the document.
 * @returns A promise that resolves when the document is added.
 */
export async function addCustomDocument(text: string): Promise<void> {
  if (!text.trim()) {
    throw new Error('Document text cannot be empty.');
  }
  customDocuments.push(text);
  console.log(`Added document to custom library. Library size: ${customDocuments.length}`);
}

/**
 * Retrieves all documents from the custom library.
 * @returns A promise that resolves with an array of all stored document texts.
 */
export async function getAllCustomDocuments(): Promise<string[]> {
  console.log(`Retrieving ${customDocuments.length} documents from custom library.`);
  return [...customDocuments]; // Return a copy
}

/**
 * Clears all documents from the custom library.
 * (Useful for testing or resetting state)
 * @returns A promise that resolves when the library is cleared.
 */
export async function clearCustomDocuments(): Promise<void> {
  customDocuments.length = 0;
  console.log('Custom document library cleared.');
}
