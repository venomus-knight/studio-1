
// src/app/actions/fetch-cloudflare-rag.ts
'use server';

import { z } from 'zod';

const CloudflareRagInputSchema = z.object({
  userQuery: z.string(),
});

export interface CloudflareRagError {
  type: 'error';
  message: string;
  details?: any;
}

export interface CloudflareRagSuccess {
  type: 'success';
  rawTextResponse: string;
}

export type FetchCloudflareRagResult = CloudflareRagSuccess | CloudflareRagError;


interface CloudflareAPIResponse {
    result?: {
        response?: string;
    };
    success: boolean;
    errors: Array<{ code: number; message: string }>;
    messages: Array<{ code: number; message: string }>;
}


export async function fetchCloudflareRag(input: z.infer<typeof CloudflareRagInputSchema>): Promise<FetchCloudflareRagResult> {
  const validation = CloudflareRagInputSchema.safeParse(input);
  if (!validation.success) {
    return { type: 'error', message: 'Invalid input.', details: validation.error.format() };
  }

  const { userQuery } = validation.data;

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const ragId = process.env.CLOUDFLARE_RAG_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !ragId || !apiToken) {
    console.error('Cloudflare API credentials or IDs are not set in environment variables. Please check your .env file. Specifically, ensure CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_RAG_ID, and CLOUDFLARE_API_TOKEN are all present and correct.');
    return { type: 'error', message: 'Server configuration error: Missing Cloudflare credentials. Ensure CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_RAG_ID, and CLOUDFLARE_API_TOKEN are set in your .env file.' };
  }

  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/autorag/rags/${ragId}/ai-search`;
  const promptForCloudflare = `${userQuery} Generate Applicable laws, Similar Precedents, and Procedural checklist for AI legal assistant for law firms.`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`, // Using Bearer token as per Cloudflare requirements
      },
      body: JSON.stringify({ query: promptForCloudflare }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Cloudflare API HTTP error: ${response.status} ${response.statusText}`, errorBody);
      return { type: 'error', message: `Cloudflare API request failed with status ${response.status}: ${response.statusText}`, details: errorBody };
    }

    const data = await response.json() as CloudflareAPIResponse;

    if (!data.success) {
      console.error('Cloudflare API returned success:false. Errors/Messages:', data.errors, data.messages);
      return { type: 'error', message: 'Cloudflare AutoRAG request was not successful.', details: data.errors || data.messages || 'No additional error details provided by Cloudflare.' };
    }
    
    // data.success is true, now check for the expected payload structure.
    if (!data.result || typeof data.result.response !== 'string') {
        console.error('Cloudflare API returned success:true but with malformed or missing result.response:', data);
        return { type: 'error', message: 'Cloudflare AutoRAG returned an unexpected response structure despite overall success.', details: data };
    }
    
    return { type: 'success', rawTextResponse: data.result.response };

  } catch (error: any) {
    console.error('Network or unexpected error calling Cloudflare AutoRAG API:', error);
    return { type: 'error', message: error.message || 'An unexpected error occurred while fetching data from Cloudflare.' };
  }
}
