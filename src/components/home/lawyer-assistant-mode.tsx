'use client';

import {summarizeDocument} from '@/ai/flows/document-summarization';
import {retrievePrecedent} from '@/ai/flows/precedent-retrieval';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Icons} from '@/components/icons';
import {Textarea} from '@/components/ui/textarea';
import React, {useState} from 'react';
import {useToast} from '@/hooks/use-toast';

export function LawyerAssistantMode() {
  const [legalDocument, setLegalDocument] = useState('');
  const [documentSummary, setDocumentSummary] = useState('');
  const [precedentQuery, setPrecedentQuery] = useState('');
  const [precedents, setPrecedents] = useState<
    {caseName: string; citation: string; summary: string}[]
  >([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const {toast} = useToast();

  const handleSummarizeDocument = async () => {
    setIsSummarizing(true);
    try {
      const result = await summarizeDocument({documentText: legalDocument});
      setDocumentSummary(result.summary);
      toast({
        title: 'Document Summarized',
        description: 'Successfully summarized the legal document.',
      });
    } catch (error: any) {
      console.error('Error summarizing document:', error);
      toast({
        title: 'Error',
        description:
          error?.message ||
          'Failed to summarize the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleRetrievePrecedent = async () => {
    setIsRetrieving(true);
    try {
      const result = await retrievePrecedent({legalQuestion: precedentQuery});
      setPrecedents(result.precedents);
      toast({
        title: 'Precedents Retrieved',
        description: 'Successfully retrieved relevant precedents.',
      });
    } catch (error: any) {
      console.error('Error retrieving precedents:', error);
      toast({
        title: 'Error',
        description:
          error?.message || 'Failed to retrieve precedents. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRetrieving(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Legal Document Summarizer</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Textarea
            placeholder="Upload or paste legal document here..."
            value={legalDocument}
            onChange={e => setLegalDocument(e.target.value)}
            className="resize-none"
          />
          <Button onClick={handleSummarizeDocument} disabled={isSummarizing}>
            {isSummarizing ? (
              <>
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              'Summarize Document'
            )}
          </Button>
          {documentSummary && (
            <div className="mt-4">
              <p className="font-bold">Document Summary:</p>
              <p>{documentSummary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Case Law Retrieval Tool</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Textarea
            placeholder="Enter legal question or case details..."
            value={precedentQuery}
            onChange={e => setPrecedentQuery(e.target.value)}
            className="resize-none"
          />
          <Button onClick={handleRetrievePrecedent} disabled={isRetrieving}>
            {isRetrieving ? (
              <>
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                Retrieving Precedents...
              </>
            ) : (
              'Retrieve Precedents'
            )}
          </Button>

          {precedents.length > 0 && (
            <div className="mt-4">
              <p className="font-bold">Precedents:</p>
              <ul>
                {precedents.map((precedent, index) => (
                  <li key={index} className="mb-2">
                    <p className="font-semibold">{precedent.caseName}</p>
                    <p className="text-sm">Citation: {precedent.citation}</p>
                    <p className="text-sm">Summary: {precedent.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
